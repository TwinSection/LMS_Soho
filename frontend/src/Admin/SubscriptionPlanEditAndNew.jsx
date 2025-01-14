import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FetchQuery from "../FetchQuery";
import { AdminPages } from "../App";

export default function SubscriptionPlanEditAndNew() {

    let nav = useNavigate();
    let params = useParams();
    let loc = useLocation();
    let IsNewCoursePage = loc.pathname.endsWith("/new");

    let [subPlan, setSubPlan] = useState({
        PlanName: "",
        Price: 0,
        DurationDays: 0
    });

    function isFormFilled() {
        return subPlan.PlanName.length > 0 && subPlan.Price > -1 && subPlan.DurationDays > 0;
    }
    
    function SaveSubPlan(e) {
        e.preventDefault();
        let newData = { ...subPlan };

        if (IsNewCoursePage) delete newData._id;

        (FetchQuery.Admin.CreateSubPlan)(undefined, newData).then((x) => {
            if (x.data) {
                setSubPlan(x.data);
                nav(AdminPages.Subscriptions);
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
                                    <Form.Label>Abonelik Plan Adı</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="PlanName"
                                        placeholder="Plan adı giriniz"
                                        value={subPlan.PlanName}
                                        onChange={(e) => { isFormFilled(); setSubPlan({ ...subPlan, PlanName: e.target.value }) }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ücret</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Price"
                                        placeholder="10"
                                        value={subPlan.Price}
                                        min="0"
                                        max="1000"
                                        onChange={(e) => {
                                            const value = Math.max(0, Math.min(1000, Number(e.target.value)));
                                            setSubPlan({ ...subPlan, Price: value });
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Süre (Gün)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="DurationDays"
                                        placeholder="10"
                                        value={subPlan.DurationDays}
                                        min="1"
                                        max="1000"
                                        onChange={(e) => {
                                            const value = Math.max(1, Math.min(1000, Number(e.target.value)));
                                            setSubPlan({ ...subPlan, DurationDays: value });
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        

                        <div className="d-grid gap-2">
                            <Button variant="outline-primary" type="submit" className="w-100"
                                onClick={SaveSubPlan} disabled={!isFormFilled()}>
                                Kaydet
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>

    </>
}