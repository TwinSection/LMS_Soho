import { useEffect, useState } from "react";
import FetchQuery from "../FetchQuery";
import { useLocation, useNavigate, useParams } from "react-router";
import { Button, Col, Row, Table } from "react-bootstrap";
import { AdminPages } from "../App";
import NotificationNew from "./NotificationNew";
import PopUpModal from "../PopUpModal";

export default function AllNotifications() {

    let [datas, setDatas] = useState([]);
    let nav = useNavigate();
    let loc = useLocation();
    let params = useParams();
    let IsNewNotificationPage = loc.pathname.endsWith("/new");
    let IsEditNotificationPage = params?.id ? true : false;

    useEffect(() => {
        FetchQuery.Admin.GetNotifications().then((x) => {
            console.log(x);
            if (x.data) {
                setDatas(x.data);
            }
        });

    }, [loc]);

    return <>
        {
            (IsNewNotificationPage || IsEditNotificationPage) && <>
                <PopUpModal
                    title={IsEditNotificationPage ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
                    show={IsEditNotificationPage || IsNewNotificationPage}
                    handleClose={() => { nav(AdminPages.Category); }}
                    Content={NotificationNew}
                />
            </>
        }
        <Row className="my-4">
            <Col>
                <h1>Tüm Bildirimler</h1>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
                <Button variant="primary" onClick={(e) => { e.preventDefault(); nav(AdminPages.Notifications + "/new") }} >Yeni Bildirim Gönder</Button>
            </Col>
        </Row>

        <Row className="my-4">
            <Col>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Baslık</th>
                            <th>Açıklama</th>
                            <th>Oluşturulma Tarihi</th>
                            <th>Aksiyon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map((item, index) => {
                            return <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.Title}</td>
                                <td>{item.Description}</td>
                                <td>{item.CreatedAt}</td>
                                <td><Button variant="danger" onClick={(e) => { e.preventDefault(); nav(AdminPages.Notifications + "/" + item._id) }} >Sil</Button></td>
                            </tr>;
                        })}
                    </tbody>
                </Table>
            </Col>
        </Row>

    </>
}