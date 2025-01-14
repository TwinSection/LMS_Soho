import { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Pages } from '../App';
import { useUserContext } from '../context/UserContext';
import FetchQuery from '../FetchQuery';


export default function UserAllCourses() {
    let { user, setUser } = useUserContext();
    let nav = useNavigate();

    let [courses, setCourses] = useState(undefined);
    let [canShow, setCanShow] = useState(true);

    useEffect(() => {
        console.log(user?.user)
        if(new Date(user?.user?.SubscriptionEndDate).getTime() < 1){
            setCanShow(false);
        }else{
            setCanShow(true);
            FetchQuery.GetCourses(user.token).then((x) => {
                if(x.data){
                    setCourses(x.data);
                }else{
                    setCourses([]);
                }
            }).catch((error) => {
                setCourses([]);
            })
        }
    }, []);

    return (
        <>
             <Container className="">
                <h1 className="mb-3">Eğitim Listesi</h1>
                {
                    (courses === undefined && canShow) && (
                        <div className="text-center">
                            <h2>Eğitimler yükleniyor...</h2>
                        </div>
                    )
                }
                {
                    !canShow && (
                        <div className="text-center">
                            <h2>Aktif Aboneliğiniz Bulunmuyor</h2>
                        </div>
                    )
                }

                <div className="px-2">
                <ListGroup>
                    {(Array.isArray(courses) ? courses : []).map((item, index) => (
                    <ListGroup.Item
                        key={index}
                        className={"d-flex ${index === lessons.length - 1 ? 'border-bottom' : ''} border-top justify-content-between align-items-center"}
                    >
                        <Row className="w-100 py-2">
                            <Col md={8}>
                                <div><strong>Eğitim Adı:</strong> {item.Title}</div>
                                <div><strong>Kategori:</strong> {item.Category.CategoryName}</div>
                            </Col>
                            <Col md={4} className="text-end">
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        let link = Pages.Course + "/" + item._id;
                                        nav(link);
                                    }}
                                >
                                    Devam Et
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    ))}
                </ListGroup>
                </div>





                
                
            </Container>
        </>
    );
};