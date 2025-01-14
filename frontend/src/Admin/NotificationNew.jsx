import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FetchQuery from "../FetchQuery";
import { AdminPages } from "../App";

export default function NotificationNew() {

    let nav = useNavigate();
    let params = useParams();
    let loc = useLocation();
    let IsNewNotificationPage = loc.pathname.endsWith("/new");

    let [notify, setNotify] = useState({
        Title: "",
        Description: "",
        CreatedAt: ""
    });

    function isFormFilled() {
        return notify.Title.length > 0 && notify.Description.length > 0;
    }
    
    function SaveNotify(e) {
        e.preventDefault();
        let newData = { ...notify };

        if (IsNewNotificationPage)
        {
            delete newData._id;
        }

        (FetchQuery.Admin.CreateNotify)(undefined, newData).then((x) => {
            if (x.data) {
                setNotify(x.data);
                nav(AdminPages.Notifications);
            } else {
                alert(x.message);
            }
        }).catch((error) => {
            console.log(error);
        });

    }

    return <>
        <div className="p-2">
            <Row className="mb-3">
                <Col>
                    <Form >
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Bildirim Başlığı</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Title"
                                        placeholder="Bildirim başlığı giriniz"
                                        value={notify.Title}
                                        onChange={(e) => { setNotify({ ...notify, Title: e.target.value }) }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>İçerik</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Description"
                                        placeholder="Bildirim içeriği giriniz"
                                        value={notify.Description}
                                        onChange={(e) => {
                                            setNotify({ ...notify, Description: e.target.value });
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        

                        <div className="d-grid gap-2">
                            <Button variant="outline-primary" type="submit" className="w-100"
                                onClick={SaveNotify} disabled={!isFormFilled()}>
                                Kaydet
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>

    </>
}