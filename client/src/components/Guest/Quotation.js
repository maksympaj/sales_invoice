import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Document,
  Image,
  Font,
  Page,
  PDFViewer,
  Text,
  StyleSheet,
  View,
  Tspan,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Warning as WarningIcon } from "@mui/icons-material";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

import microsoft_yahei from "fonts/chinese.msyh.ttf";
import logoTitle from "images/logo_title.png";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  header: {
    width: "100%",
    fontSize: 8,
    lineHeight: 1.2,
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Microsoft Yahei",
    fontSize: 15,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  logo: {
    marginLeft: "auto",
    width: 50,
  },
  info: {
    flexDirection: "row",
    marginBottom: 10,
  },
  companyInfo: {
    fontFamily: "Microsoft Yahei",
    fontSize: 8,
    width: 200,
    paddingRight: 10,
    lineHeight: 1.2,
  },
  clientInfo: {
    fontFamily: "Microsoft Yahei",
    fontSize: 8,
    width: 200,
    paddingRight: 10,
    lineHeight: 1.2,
  },
  email: {
    color: "#0000ff",
    textDecoration: "underline",
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontWeight: 100,
    fontFamily: "Microsoft Yahei",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  table: {
    fontSize: 8,
    marginBottom: 10,
    border: "0.5px solid #808080",
  },
  tableRow: {
    fontSize: 8,
    borderBottom: "0.5px solid #808080",
    flexDirection: "row",
    minHeight: 15,
    fontFamily: "Microsoft Yahei",
  },
  tableColumn: {
    flex: 1,
    padding: "3px 5px",
    borderRight: "0.5px solid #808080",
  },
});

Font.register({
  family: "Microsoft Yahei",
  src: microsoft_yahei,
});

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const mapStateToProps = (state) => {
  const loading = state.loading.value;
  return { loading };
};

export default connect(mapStateToProps)((props) => {
  const { loading } = props;
  const [success, setSuccess] = useState(false);
  const [quotation, setQuotation] = useState({
    Seller: {},
    ChairStocks: [],
    DeskStocks: [],
    AccessoryStocks: [],
    ServiceToQuotations: [],
    DeskToQuotations: [],
  });
  const { id } = useParams();
  useEffect(() => {
    const source = axios.CancelToken.source();
    getQuotation({ id, cancelToken: source.token });
    return () => source.cancel("Brand Component got unmounted");
  }, [id]);

  const getDateString = (time) => {
    const tmp = new Date(time);
    return `${
      monthNames[tmp.getMonth()]
    } ${tmp.getDate()}, ${tmp.getFullYear()}`;
  };

  const getDateNum = (time) => {
    const tmp = new Date(time);
    return `${tmp.getFullYear()}${tmp.getMonth()}${tmp.getDate()}`;
  };

  const getQuotation = ({ id, cancelToken }) => {
    axios
      .get(`/quotation/${id}`, { cancelToken })
      .then((response) => {
        // handle success
        setSuccess(true);
        setQuotation(response.data);
      })
      .catch(function (error) {
        // handle error
        setSuccess(false);
      });
  };

  return loading ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : success ? (
    <PDFViewer height="100%">
      <Document>
        <Page style={styles.body} wrap>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Quotation</Text>
              <Text>Date: {getDateString(quotation.createdAt)}</Text>
              <Text>
                {`No: Q-${quotation.Seller.prefix}${getDateNum(
                  quotation.createdAt
                )}${("000" + quotation.quotationNum).substr(-3)}`}
              </Text>
            </View>
            <View style={styles.logo}>
              <Image src={logoTitle} />
            </View>
          </View>
          <View style={styles.info}>
            <View style={styles.companyInfo}>
              <Text>Blueocean International (HK) Ltd.</Text>
              <Text>23/F</Text>
              <Text>Lockhart Centre</Text>
              <Text>801-807 Lockhart Rd</Text>
              <Text>Wenchai, Hong Kong</Text>
              <Text>Tel: 2169 3337</Text>
              <Text>
                Email: <Tspan style={styles.email}>info@ergoseatings.com</Tspan>
              </Text>
            </View>
            <View style={styles.clientInfo}>
              <Text>Client's Name: {quotation.name}</Text>
              {quotation.unit ? <Text>Unit {quotation.unit}</Text> : null}
              {quotation.floor ? <Text>Floor {quotation.floor}</Text> : null}
              {quotation.block ? <Text>Block {quotation.block}</Text> : null}
              <Text>{quotation.street}</Text>
              <Text>{quotation.district}</Text>
              <Text>Phone: {quotation.phone}</Text>
              <Text>
                Email: <Tspan style={styles.email}>{quotation.email}</Tspan>
              </Text>
            </View>
          </View>
          <View style={styles.table}>
            {[
              {
                cells: [
                  { content: "Salesperson", width: "15%" },
                  { content: "Proposed Delivery Date", width: "55%" },
                  { content: "Payment Terms", width: "15%" },
                  { content: "Valid Til", textAlign: "right", width: "15%" },
                ],
                backgroundColor: "#dbe5f1",
                textTransform: "uppercase",
              },
              {
                cells: [
                  {
                    content: `${quotation.Seller.firstName} ${quotation.Seller.lastName}`,
                    width: "15%",
                  },
                  {
                    content:
                      (quotation.timeLine % 7 === 0
                        ? `Est ${quotation.timeLine / 7} working week${
                            quotation.timeLine / 7 === 1 ? "" : "s"
                          } after payment`
                        : `Est ${quotation.timeLine} working day${
                            quotation.timeLine === 1 ? "" : "s"
                          } after payment`) + '\n' + `${quotation.remark}`,
                    width: "55%",
                  },
                  { content: quotation.paymentTerms, width: "15%" },
                  {
                    content: `${quotation.validTil} month${
                      quotation.validTil === 1 ? "" : "s"
                    }`,
                    textAlign: "right",
                    width: "15%",
                  },
                ],
              },
            ].map(({ cells, ...rowRestProps }, rowIndex, rowArr) => (
              <View
                key={rowIndex}
                style={[
                  styles.tableRow,
                  {
                    borderBottom:
                      rowIndex === rowArr.length - 1 ? "none" : null,
                    ...rowRestProps,
                  },
                ]}
              >
                {cells.map(
                  ({ content, width, ...cellRestProps }, index, cellArr) => (
                    <Text
                      key={index}
                      style={[
                        styles.tableColumn,
                        {
                          borderRight:
                            index === cellArr.length - 1 ? "none" : null,
                          flexBasis: width,
                          maxWidth: width,
                          ...cellRestProps,
                        },
                      ]}
                    >
                      {content}
                    </Text>
                  )
                )}
              </View>
            ))}
          </View>
          <View style={styles.table}>
            {[
              {
                cells: [
                  { content: "QTY", width: "15%" },
                  { content: "Description", width: "55%" },
                  { content: "Unit Price", width: "15%" },
                  {
                    content: "Line Total (HKD)",
                    textAlign: "right",
                    width: "15%",
                  },
                ],
                backgroundColor: "#dbe5f1",
                textTransform: "uppercase",
              },
              ...quotation.ChairStocks.map((item) => ({
                cells: [
                  {
                    content: `${item.ChairToQuotation.qty}`,
                    width: "15%",
                  },
                  {
                    content: `Chair Brand: ${item.brand}
                      Chair Model: ${item.model}\n${item.withHeadrest ? "With Headrest" : "Without Headrest"}
                      ${item.withAdArmrest ? "With Adjustable Armrest" : "Without Adjustable Armrest"}
                      Specification: ${item.ChairToQuotation.remark}
                      Other Remark: ${item.remark}
                      ${JSON.parse(item.ChairToQuotation.deliveryOption)}`,
                    width: "55%",
                  },
                  {
                    content: `${item.ChairToQuotation.unitPrice}`,
                    textAlign: "right",
                    width: "15%",
                  },
                  {
                    content: `${
                      item.ChairToQuotation.unitPrice *
                      item.ChairToQuotation.qty
                    }`,
                    textAlign: "right",
                    width: "15%",
                  },
                ],
              })),
              ...quotation.DeskToQuotations.map((item) => ({
                cells: [
                  {
                    content: `${item.qty}`,
                    width: "15%",
                  },
                  {
                    content: `Desk Model: ${
                      quotation.DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).model
                    }
                    Color of Legs: ${
                      quotation.DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).color
                    }
                    ArmSize: ${
                      quotation.DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).armSize
                    }
                    FeetSize: ${
                      quotation.DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).feetSize
                    }
                    Beam Size: ${
                      quotation.DeskStocks.find(
                        (stock) => stock.id === item.stockId
                      ).beamSize
                    }
                    ${
                      item.hasDeskTop
                        ? `Table Top: ${item.topMaterial}
                        Table Top Size: ${item.topLength}x${item.topWidth}x${
                            item.topThickness
                          }
                        Table Top Color: ${item.topColor}${
                            item.topRoundedCorners === 0
                              ? ""
                              : `\nRounded Corners: ${item.topRoundedCorners}, Radius: R${item.topCornerRadius}`
                          }${
                            item.topHoleCount === 0
                              ? ""
                              : `\nHoles Required: ${item.topHoleCount}, Hole Position: ${item.topHolePosition}, Holes Shaped: ${item.topHoleType}`
                          }
                        Specification: ${item.remark}
                        Other Remark: ${quotation.DeskStocks.find((stock) => stock.id === item.stockId).remark}`
                        : "Without DeskTop"
                    }
                    ${JSON.parse(item.deliveryOption)}`,
                    width: "55%",
                  },
                  {
                    content: `${item.unitPrice}`,
                    textAlign: "right",
                    width: "15%",
                  },
                  {
                    content: `${item.unitPrice * item.qty}`,
                    textAlign: "right",
                    width: "15%",
                  },
                ],
              })),
              ...quotation.AccessoryStocks.map((item) => ({
                cells: [
                  {
                    content: `${item.AccessoryToQuotation.qty}`,
                    width: "15%",
                  },
                  {
                    content: `${item.name}\nAccessory Category: ${item.category }
                      Specification: ${item.AccessoryToQuotation.remark}
                      Other Remark: ${item.remark}
                      ${JSON.parse(item.AccessoryToQuotation.deliveryOption)}`,
                    width: "55%",
                  },
                  {
                    content: `${item.AccessoryToQuotation.unitPrice}`,
                    textAlign: "right",
                    width: "15%",
                  },
                  {
                    content: `${
                      item.AccessoryToQuotation.unitPrice *
                      item.AccessoryToQuotation.qty
                    }`,
                    textAlign: "right",
                    width: "15%",
                  },
                ],
              })),
              ...quotation.ServiceToQuotations.map((item) => ({
                cells: [
                  {
                    content: "1",
                    width: "15%",
                  },
                  {
                    content: `${item.description}`,
                    width: "55%",
                  },
                  {
                    content: `${item.price}`,
                    textAlign: "right",
                    width: "15%",
                  },
                  {
                    content: `${item.price}`,
                    textAlign: "right",
                    width: "15%",
                  },
                ],
              })),
              ...Array(
                Math.max(
                  0,
                  6 -
                    quotation.ChairStocks.length -
                    quotation.DeskStocks.length -
                    quotation.AccessoryStocks.length -
                    quotation.ServiceToQuotations.length
                )
              ).fill({
                cells: [
                  { content: "", width: "15%" },
                  { content: "", width: "55%" },
                  { content: "", width: "15%" },
                  { content: "", width: "15%" },
                ],
              }),
              {
                cells: [
                  {
                    content: ``,
                    width: "70%",
                    fontSize: 12,
                  },
                  { content: "SUBTOTAL", width: "15%" },
                  {
                    content: `${
                      (quotation.ChairStocks.length
                        ? quotation.ChairStocks.map(
                            (item) =>
                              item.ChairToQuotation.unitPrice *
                              item.ChairToQuotation.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (quotation.DeskToQuotations.length
                        ? quotation.DeskToQuotations.map(
                            (item) => item.unitPrice * item.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (quotation.AccessoryStocks.length
                        ? quotation.AccessoryStocks.map(
                            (item) =>
                              item.AccessoryToQuotation.unitPrice *
                              item.AccessoryToQuotation.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (quotation.ServiceToQuotations.length
                        ? quotation.ServiceToQuotations.map(
                            (item) => item.price
                          ).reduce((acc, cur) => acc + cur)
                        : 0)
                    }`,
                    textAlign: "right",
                    width: "15%",
                    borderBottom: "0.5px solid #808080",
                  },
                ],
                borderBottom: "none",
              },
              {
                cells: [
                  {
                    content: ``,
                    width: "70%",
                    fontSize: 12,
                  },
                  { content: "DISCOUNT", width: "15%" },
                  {
                    content: `${
                      quotation.discountType
                        ? quotation.discount
                        : (((quotation.ChairStocks.length
                            ? quotation.ChairStocks.map(
                                (item) =>
                                  item.ChairToQuotation.unitPrice *
                                  item.ChairToQuotation.qty
                              ).reduce((acc, cur) => acc + cur)
                            : 0) +
                            (quotation.DeskStocks.length
                              ? quotation.DeskStocks.map(
                                  (item) =>
                                    item.DeskToQuotation.unitPrice *
                                    item.DeskToQuotation.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0) +
                            (quotation.AccessoryStocks.length
                              ? quotation.AccessoryStocks.map(
                                  (item) =>
                                    item.AccessoryToQuotation.unitPrice *
                                    item.AccessoryToQuotation.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0)) *
                            quotation.discount) /
                          100
                    }`,
                    textAlign: "right",
                    width: "15%",
                    borderBottom: "0.5px solid #808080",
                  },
                ],
                borderBottom: "none",
              },
              {
                cells: [
                  {
                    content: ``,
                    width: "70%",
                    fontSize: 12,
                  },
                  { content: "SURCHARGE", width: "15%" },
                  {
                    content: `${
                      quotation.surchargeType
                        ? quotation.surcharge
                        : (((quotation.ChairStocks.length
                            ? quotation.ChairStocks.map(
                                (item) =>
                                  item.ChairToQuotation.unitPrice *
                                  item.ChairToQuotation.qty
                              ).reduce((acc, cur) => acc + cur)
                            : 0) +
                            (quotation.DeskStocks.length
                              ? quotation.DeskStocks.map(
                                  (item) =>
                                    item.DeskToQuotation.unitPrice *
                                    item.DeskToQuotation.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0) +
                            (quotation.AccessoryStocks.length
                              ? quotation.AccessoryStocks.map(
                                  (item) =>
                                    item.AccessoryToQuotation.unitPrice *
                                    item.AccessoryToQuotation.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0)) *
                            quotation.surcharge) /
                          100
                    }`,
                    textAlign: "right",
                    width: "15%",
                    borderBottom: "0.5px solid #808080",
                  },
                ],
                borderBottom: "none",
              },
              {
                cells: [
                  {
                    content: ``,
                    width: "70%",
                    fontSize: 12,
                  },
                  { content: "TOTAL", width: "15%" },
                  {
                    content: `${
                      (quotation.ChairStocks.length
                        ? quotation.ChairStocks.map(
                            (item) =>
                              item.ChairToQuotation.unitPrice *
                              item.ChairToQuotation.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (quotation.DeskToQuotations.length
                        ? quotation.DeskToQuotations.map(
                            (item) => item.unitPrice * item.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (quotation.AccessoryStocks.length
                        ? quotation.AccessoryStocks.map(
                            (item) =>
                              item.AccessoryToQuotation.unitPrice *
                              item.AccessoryToQuotation.qty
                          ).reduce((acc, cur) => acc + cur)
                        : 0) +
                      (quotation.ServiceToQuotations.length
                        ? quotation.ServiceToQuotations.map(
                            (item) => item.price
                          ).reduce((acc, cur) => acc + cur)
                        : 0) -
                      (quotation.discountType
                        ? quotation.discount
                        : (((quotation.ChairStocks.length
                            ? quotation.ChairStocks.map(
                                (item) =>
                                  item.ChairToQuotation.unitPrice *
                                  item.ChairToQuotation.qty
                              ).reduce((acc, cur) => acc + cur)
                            : 0) +
                            (quotation.DeskStocks.length
                              ? quotation.DeskStocks.map(
                                  (item) =>
                                    item.DeskToQuotation.unitPrice *
                                    item.DeskToQuotation.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0) +
                            (quotation.AccessoryStocks.length
                              ? quotation.AccessoryStocks.map(
                                  (item) =>
                                    item.AccessoryToQuotation.unitPrice *
                                    item.AccessoryToQuotation.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0)) *
                            quotation.discount) /
                          100) +
                      (quotation.surchargeType
                        ? quotation.surcharge
                        : (((quotation.ChairStocks.length
                            ? quotation.ChairStocks.map(
                                (item) =>
                                  item.ChairToQuotation.unitPrice *
                                  item.ChairToQuotation.qty
                              ).reduce((acc, cur) => acc + cur)
                            : 0) +
                            (quotation.DeskStocks.length
                              ? quotation.DeskStocks.map(
                                  (item) =>
                                    item.DeskToQuotation.unitPrice *
                                    item.DeskToQuotation.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0) +
                            (quotation.AccessoryStocks.length
                              ? quotation.AccessoryStocks.map(
                                  (item) =>
                                    item.AccessoryToQuotation.unitPrice *
                                    item.AccessoryToQuotation.qty
                                ).reduce((acc, cur) => acc + cur)
                              : 0)) *
                            quotation.surcharge) /
                          100)
                    }`,
                    textAlign: "right",
                    width: "15%",
                  },
                ],
              },
            ].map(({ cells, ...rowRestProps }, rowIndex, rowArr) => (
              <View
                key={rowIndex}
                style={[
                  styles.tableRow,
                  {
                    borderBottom:
                      rowIndex === rowArr.length - 1 ? "none" : null,
                    ...rowRestProps,
                  },
                ]}
              >
                {cells.map(
                  ({ content, width, ...cellRestProps }, index, cellArr) => (
                    <Text
                      key={index}
                      style={[
                        styles.tableColumn,
                        {
                          borderRight:
                            index === cellArr.length - 1 ? "none" : null,
                          flexBasis: width,
                          maxWidth: width,
                          ...cellRestProps,
                        },
                      ]}
                    >
                      {content}
                    </Text>
                  )
                )}
              </View>
            ))}
            <Text
              style={{
                fontSize: 12,
                padding: 3,
                position: "absolute",
                width: "70%",
                bottom: 0,
                left: 0,
              }}
            >
              Blueocean International (HK) Ltd. \r\n
              NOTE: Please deposit to HSBC 023-472038-838 (bank code: 004, Bank
              address: 1 Queen's Road Central, Hong Kong. SWIFT code:
              HSBCHKHHHKH or FPS: info@ergoseatings.com
            </Text>
          </View>
          {[
            `Should the delivery of goods involved any staircases at the provided location, there will be an additional delivery fee of HK$100 per level to be charged in advance.`,
            `If you have special assembling requirements, please let us know prior to delivery.  Otherwise, all chairs will be assembled before delivery and all desks will be assembled on site.`,
            `If the delivery address is located in a remote area within Hong Kong, we reserve the rights to charge the client extra for delivery charges.  In such cases, we will provide a quotation upon investigation of the detailed address.  Client will be notified of such extra cost prior to delivery.`,
            `Delivery date for pre-orders stated above is an estimate only. While we will try our best to deliver the products as soon as possible, the actual delivery date may be adjusted depending on actual freight schedule. We do NOT accept refund in case of delay arising from delivery delay.`,
            `You understand that pre-orders are non-refundable.  Decision to switch to another product after purchase can only be treated as store credits. `,
            `You understand that a late payment penalty of 2% Interest Rate per month maybe charged for overdue payment`,
          ].map((text, index) => (
            <View key={index} style={{ flexDirection: "row", margin: "5px 0" }}>
              <View
                style={{
                  width: 2,
                  fontSize: 10,
                  lineHeight: 1.2,
                  margin: "0 10px 0 0",
                  color: "#888888",
                }}
              >
                <Text>•</Text>
              </View>
              <View
                style={{
                  flexGrow: 1,
                  fontSize: 10,
                  lineHeight: 1.2,
                  color: "#888888",
                }}
              >
                <Text>{text}</Text>
              </View>
            </View>
          ))}
          <Text
            style={{
              marginTop: "5px",
              fontSize: 10,
              lineHeight: 1.2,
              color: "#888888",
            }}
          >
            The warranty is effective from the date of purchase from Blueocean
            International (HK) Ltd by the original purchaser. Such warranty
            applies under the following terms and conditions and is covered by
            the original manufacturers for specific period stated:
          </Text>
          {[
            `Nightingale chairs: 5 years for defective parts under regular usage, by Nightingale Corp.`,
            `Allseating chairs:  5 years for defective parts under regular usage, by Allseating Corp.`,
            `Standing desks: 5 years by manufacturer`,
            `Okamura chairs:  5 years for defective parts under regular usage, by Okamura Salotto HK Ltd.`,
            `10 years for structural defective parts, under regular usage by Okamura Salotto HK Ltd, for details please refer to our website FAQ section.`,
            `Bestuhl chairs: 3 years for defective parts under regular usage, by Bestuhl Co. Ltd.`,
            `Duorest chairs: 3 years for defective parts under regular usage, by Duoback Co. Ltd.`,
            `Wagner chairs: 5 years for defective parts under regular usage, by Topstar GMBH`,
            `Topstar chairs: 3 years for defective parts under regular usage, by Topstar GMBH`,
            `Ergohuman chairs: 2 years for defective parts under regular usage, by manufacturer`,
            // `HAG chairs: 2 years for defective parts under regular usage, by manufacturer`,
            `Atlas Headrest, 3 years for defective parts under regular usage, by Back Foley LLC`,
          ].map((text, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", marginLeft: "10px" }}
            >
              <View
                style={{
                  width: 2,
                  height: 2,
                  margin: "5px 10px 0 0",
                  backgroundColor: "#888888",
                }}
              />
              <View
                style={{
                  flexGrow: 1,
                  fontSize: 10,
                  lineHeight: 1.2,
                  color: "#888888",
                }}
              >
                <Text>{text}</Text>
              </View>
            </View>
          ))}
          <Text
            style={{
              fontSize: 10,
              lineHeight: 1.2,
              marginTop: 10,
              color: "#888888",
            }}
          >
            Claiming of any aforementioned warranties only covers replacement of
            the defective or broken parts only and does not include the
            following cost, which shall be borne by the claimant. A quotation
            will be provided in advance for approval by the claimant: 1) labor
            costs of technician for replacing the parts; 2) transportation costs
            incurred for sending the product(s) to our company and delivering
            back to the claimant from our shop after service. I, the
            undersigned, have read and understand these policies and agree to
            all the above.
          </Text>
          <Text
            style={{
              fontSize: 10,
              lineHeight: 1.2,
              marginTop: 10,
              color: "#888888",
            }}
          >
            Agreement to this quotation represents that client understands our
            refund policy and terms and condition as stated in our website
            ergoseatings.com and ergoseatings.com.hk
          </Text>
          <Text
            style={{
              fontSize: 10,
              lineHeight: 1.2,
              marginTop: 10,
              color: "#888888",
            }}
          >
            Initials: _________________
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 1.2,
              marginTop: 12,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Thank you for your business!
          </Text>
        </Page>
      </Document>
    </PDFViewer>
  ) : (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <WarningIcon />
      <Typography>This url is not a valid quotation url.</Typography>
    </Backdrop>
  );
});
