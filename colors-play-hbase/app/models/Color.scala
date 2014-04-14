package models

import play.api.Logger
import org.apache.hadoop.hbase.client.HBaseAdmin
import org.apache.hadoop.hbase.HTableDescriptor
import org.apache.hadoop.hbase.HBaseConfiguration
import org.apache.hadoop.hbase.util.Bytes
import org.apache.hadoop.hbase.TableName
import org.apache.hadoop.hbase.HColumnDescriptor
import org.apache.hadoop.hbase.client.HTable
import org.apache.hadoop.hbase.client.Scan
import scala.collection.mutable.MutableList
import org.apache.hadoop.hbase.client.Put
import java.util.UUID
import play.api.libs.json.Json
import play.api.libs.json.Writes
import play.api.libs.json.JsPath
import play.api.libs.functional.syntax._
import org.apache.hadoop.hbase.client.Result
import org.apache.hadoop.hbase.filter.Filter
import org.apache.hadoop.hbase.filter.ValueFilter
import org.apache.hadoop.hbase.filter.CompareFilter.CompareOp
import org.apache.hadoop.hbase.filter.RegexStringComparator
import org.apache.hadoop.hbase.client.Delete
import org.apache.hadoop.hbase.filter.SubstringComparator
import org.apache.hadoop.hbase.filter.SingleColumnValueFilter

case class Color(id: Long, color: String)

object Color {

  // for HBase
  val colorsTableName = TableName.valueOf("colors")
  val family = Bytes.toBytes("all")
  val idQualifier = Bytes.toBytes("id")
  val colorQualifier = Bytes.toBytes("color")

  lazy val hbaseConfig = {
    val conf = HBaseConfiguration.create()
    
    // zookeeper server list
    conf.set("hbase.zookeeper.quorum", "hvm01.ibcf.test,hvm04.ibcf.test,hvm05.ibcf.test");
    val hbaseAdmin = new HBaseAdmin(conf)

    if (!hbaseAdmin.tableExists(colorsTableName)) {
      val desc = new HTableDescriptor(colorsTableName)
      desc.addFamily(new HColumnDescriptor(family))
      hbaseAdmin.createTable(desc)
      Logger.info("colors table created")
    }

    // return the HBase config
    conf
  }

  def findAll = {
    val table = new HTable(hbaseConfig, colorsTableName)
    val scan = new Scan()
    scan.addFamily(family)
    val scanner = table.getScanner(scan)
    val colorList = MutableList[Color]()
    try {
      val it = scanner.iterator
      while (it.hasNext == true) {
        val rs = it.next
        val id = Bytes.toLong(rs.getValue(family, idQualifier))
        Logger.debug("id: " + id)
        val color = Bytes.toString(rs.getValue(family, colorQualifier))
        Logger.debug("color: " + color)
        val c = Color(id, color)
        colorList += Color(id, color)
        Logger.debug("add: " + c)
      }

      Logger.debug("findAll: " + colorList.toString)
    } finally {
      scanner.close
      table.close
    }

    colorList.toList.sortBy(_.id)
  }

  def newId = {
    val table = new HTable(hbaseConfig, colorsTableName)
    val scan = new Scan()
    scan.addColumn(family, idQualifier)

    val scanner = table.getScanner(scan)
    val idList = MutableList[Long]()

    try {
      val it = scanner.iterator
      while (it.hasNext == true) {
        val id = Bytes.toLong(it.next.getValue(family, idQualifier))
        idList += id
      }
    } finally {
      scanner.close
      table.close
    }

    if (idList.isEmpty) {
      Logger.debug("id = " + 1)
      1
    } else {
      val lastId = idList.max
      Logger.debug("lasdId = " + lastId + ", newId = " + (lastId + 1))

      lastId + 1
    }
  }

  def save(color: String) = {
    Logger.debug("save: " + color)

    val table = new HTable(hbaseConfig, colorsTableName)

    val id = newId
    try {
      val p = new Put(Bytes.toBytes(UUID.randomUUID().toString()))
      p.add(family, idQualifier, Bytes.toBytes(id))
      p.add(family, colorQualifier, Bytes.toBytes(color))
      table.put(p)
    } catch {
      case e: Exception => {
        throw e;
      }
    } finally {
      table.close
    }

    Color(id, color)
  }

  private def findRowsById(id: Long) = {
    val table = new HTable(hbaseConfig, colorsTableName)
    val scan = new Scan()
    scan.addColumn(family, Bytes.toBytes("id"))

    // set filter
    val f = new SingleColumnValueFilter(family, idQualifier,
      CompareOp.EQUAL, Bytes.toBytes(id))
    scan.setFilter(f)

    val scanner = table.getScanner(scan)
    val rowKeys = MutableList[Array[Byte]]()
    try {
      val it = scanner.iterator()
      while (it.hasNext == true) {
        val rowKey = it.next.getRow
        Logger.debug("rowKey: " + rowKey.toString())
        rowKeys += rowKey
      }
    } finally {
      scanner.close
      table.close
    }

    rowKeys.toList
  }

  def delete(c: Color) {
    Logger.debug("id = " + c.id + ", color = " + c.color)
    val table = new HTable(hbaseConfig, colorsTableName)
    val rowKeys = findRowsById(c.id)

    try {
      for (rowKey <- rowKeys) table.delete(new Delete(rowKey))
    } finally {
      table.close
    }
  }
}