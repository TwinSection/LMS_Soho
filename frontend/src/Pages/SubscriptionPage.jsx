import { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Offcanvas, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import FetchQuery from '../FetchQuery';

import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router';

export default function SubscriptionPage() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    let { user } = useUserContext();
    let nav = useNavigate()

    useEffect(() => {
        FetchQuery.GetSubPlans().then((x) => {
            if (x.data) {
                console.log(x.data);
                setPlans(x.data);
            }
        });
    }, []);

    const handleCardClick = (planId) => {
        setSelectedPlan(planId);
    };

    function SubToSubPlan(e) {
        e.preventDefault();
        console.log(selectedPlan);
        if (selectedPlan) {
            FetchQuery.SubToSubPlans(user.token, selectedPlan).then((x) => {
                console.log(x);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                nav(0)
            })
        }
    }

    const formatDate = {
        options : {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
    }

    return (
        <Container className="py-5">
            {
                plans.length === 0 && (
                    <div className="text-center">
                        <h2>Size uygun planlar yükleniyor...</h2>
                    </div>
                )
            }

            {
                (new Date(user?.user?.SubscriptionEndDate).getTime() > 0) ? 
                <>
                    <Alert variant="info">
                        <p>Abonelik almanıza gerek yok. Var olan aboneliğiniz bitiş tarihi: <b>{new Intl.DateTimeFormat('tr-TR', formatDate.options).format(new Date(user?.user?.SubscriptionEndDate)).replace(" ", " | Saat: ")}</b></p>
                    </Alert>
                </> : 
                <>
                    <Alert variant="danger">Aktif bir aboneliğiniz <b>bulunmuyor</b>.</Alert>
                </>
            }
            <>
                <Row className="justify-content-center mb-4 mt-2">
                    {
                    (Array.isArray(plans) ? plans : []).map((plan) => (
                        <Col key={plan._id} xs={12} md={4} className="mb-4">
                            <Card
                                onClick={() => handleCardClick(plan._id)}
                                className="h-100"
                                style={{
                                    cursor: 'pointer',
                                    border: selectedPlan === plan._id ? '2px solid #007bff' : '1px solid #dee2e6',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-center mb-4">{plan.PlanName}</Card.Title>
                                    <Card.Text className="text-center mb-4 h2">{plan.Price} TL</Card.Text>
                                    <Card.Text className="text-center mb-4 h2">{plan.DurationDays} Gün</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} className="text-center">
                        <Button
                            size="lg"
                            disabled={!selectedPlan}
                            variant={selectedPlan ? 'primary' : 'secondary'}
                            onClick={SubToSubPlan}
                        >
                            SATIN AL
                        </Button>
                    </Col>
                </Row>

            </>

        </Container>
    );
}