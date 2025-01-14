import InstructorSidebar from "./InstructorSidebar";

import { Container, Row, Col, Nav } from "react-bootstrap"
import { Outlet } from 'react-router';

export default function InstructorHome() {

    return <Container fluid style={{ height: "100vh" }}>
        <Row style={{ height: "100%" }}>
            <InstructorSidebar />
            <Col md={10} style={{ backgroundColor: "#ffffff", padding: "1rem", overflowY: "auto" }}>
                <Container>
                    <Outlet />
                </Container>
            </Col>
        </Row>
    </Container>
}