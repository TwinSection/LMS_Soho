import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Pages } from '../App';
import { useUserContext } from '../context/UserContext';


export default function HomePage() {
    let {user} = useUserContext();
    let nav = useNavigate();

    return (
        <>
            <Container >
                
                <p>Merhaba <b>{user?.user?.Name} {user?.user?.Surname}</b></p>

                <Row>
                    <Col md={6} className="mb-4">
                        <Button size='lg' variant='primary' onClick={(e) => { e.preventDefault(); nav(Pages.Courses) }}>Kurslar</Button>
                    </Col>
                    <Col md={6} className="mb-4">
                        <Button size='lg' variant='dark' onClick={(e) => { e.preventDefault(); nav(Pages.Subscriptions) }}>Abonelikler</Button>
                    </Col>
                </Row>
                
            </Container>
        </>
    );
};