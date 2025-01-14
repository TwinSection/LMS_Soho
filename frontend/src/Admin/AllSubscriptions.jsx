import { useEffect, useState } from "react";
import FetchQuery from "../FetchQuery";
import { Button, Card, Col, Row, Table, Modal } from "react-bootstrap";
import { AdminPages } from "../App";
import { useLocation, useNavigate, useParams } from "react-router";
import SubscriptionPlanEditAndNew from "./SubscriptionPlanEditAndNew";
import PopUpModal from "../PopUpModal";

export default function AllSubscriptions() {

    let [datas, setDatas] = useState([]);
    let nav = useNavigate();
    let loc = useLocation();
    let params = useParams();
    let IsNewSubPlanPage = loc.pathname.endsWith("/new");

    useEffect(() => {
        FetchQuery.Admin.GetSubPlans().then((x) => {
            console.log(x);
            if (x.data) {
                setDatas(x.data);
            }
        });

    }, []);

    return <>
        {
            (IsNewSubPlanPage) && <>
                <PopUpModal
                    title={"Yeni Abonelik Planı Ekle"}
                    show={IsNewSubPlanPage}
                    handleClose={() => { nav(AdminPages.Subscriptions); }}
                    Content={SubscriptionPlanEditAndNew}
                />
            </>
        }
        <Row className="my-4">
            <Col>
                <h1>Tüm Abonelik Planları</h1>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
                <Button variant="primary" onClick={(e) => { e.preventDefault(); nav(AdminPages.Subscriptions + "/new") }} >Yeni Abonelik Planı Ekle</Button>
            </Col>
        </Row>

        <Row>
            <Col>
                {
                    !(datas === undefined || datas === null || datas.length == 0) ?
                        (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Abonelik Plan Adı</th>
                                        <th>Ücret</th>
                                        <th>Gün</th>
                                        <th>Aksiyon</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(datas) ? datas : []).map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item?.PlanName}</td>
                                            <td>{item?.Price}</td>
                                            <td>{item?.DurationDays}</td>
                                            <td><Button variant="danger"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    let link = AdminPages.Courses + "/" + item._id;
                                                    nav(link);
                                                }}
                                            >Sil</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) :
                        (
                            <h3>Veritabanında abonelik planı bulunamadı.</h3>
                        )
                }

            </Col>
        </Row>

    </>
}