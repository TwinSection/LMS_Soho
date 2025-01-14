import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, ListGroup } from 'react-bootstrap';
import NavbarArea from './NavbarArea';
import FetchQuery from '../FetchQuery';
import { useLocation, useParams } from 'react-router';
import { useUserContext } from '../context/UserContext';
import PopUpModal from '../PopUpModal';

export default function CourseDetailPage() {
    const [showModal, setShowModal] = useState(false);
    const [currentLesson, setCurrentLesson] = useState({ title: '', content: '' });
    let loc = useLocation();

    const toggleModal = (lesson) => {
        setCurrentLesson({ title: lesson.Title, content: lesson.Content });
        setShowModal(!showModal);
    };

    let { user, setUser } = useUserContext();
    let params = useParams();

    let [course, setCourse] = useState(undefined);

    useEffect(() => {
        let _id = params.id;
        console.log("_id", _id);
        if (!_id) {
            setCourse(undefined);
            return;
        }
        FetchQuery.GetCourse(user.token, _id).then((x) => {
            if (x.data) {
                setCourse(x.data);
            } else {
                setCourse(undefined);
            }
        }).catch((error) => {
            setCourse(undefined);
            console.log("Error: ", error);
        })
    }, [loc]);

    const [completed, setCompleted] = useState({});

    useEffect(() => {
        let tempCompleteArray = [];

        if (course) {
            for (let i = 0; i < course.LessonList.length; i++) {
                FetchQuery.GetProgress(user.token, user, course._id).then((x) => {
                    tempCompleteArray = x.data.progressList;
                }).catch((error) => {
                    console.log("Error: ", error);
                }).finally(() => {
                    setCompleted(tempCompleteArray);
                })
            }
        }

    }, [course]);

    const toggleCompletion = (lesson) => {
        setCompleted((prev) => {
            const newState = {
                ...prev,
                [lesson._id]: !prev[lesson._id],
            };
            console.log(lesson._id + ". Ders durumu: " + (newState[lesson._id] ? "Tamamlandı" : "Tamamlanmadı"));
            FetchQuery.ModifyProgress(user.token, lesson._id, newState[lesson._id]).then((res) => {
                console.log("Response: ", res);
            }).catch((err) => {
                console.log("Error: ", err);
            })
            return newState;
        });
    };

    const calculateProgress = () => {
        const trueCount = Object.values(completed).filter(value => value === true).length;
        const totalCount = Object.keys(completed).length;
        const truePercentage = (trueCount / totalCount) * 100;
        return truePercentage;
    }

    return (
        <Container className="container">
            <h1 className='mb-3'> {course?.Title} <small className="text-muted">(%{calculateProgress()} Tamamlandı)</small></h1>
            <p className='mx-1 px-1'> {course?.Description} </p>

            <h4 className='mt-5 px-4 pb-2'>Ders Listesi</h4>
            <div className="px-2">
                <ListGroup>
                    {((course?.LessonList) ?? []).map((lesson, index) => (
                        <ListGroup.Item
                            key={index}
                            className={"d-flex ${index === lessons.length - 1 ? 'border-bottom' : ''} border-top justify-content-between align-items-center"}
                        >
                            <Row className="w-100 py-2">
                                <Row className="align-items-center">
                                    <Col sm={8} className='fw-bold'>{lesson.Title}</Col>
                                    <Col sm={4} className="text-end">
                                        <Button
                                            variant="primary"
                                            size="md"
                                            className="me-2"
                                            onClick={() => toggleModal(lesson)}
                                        >
                                            Görüntüle
                                        </Button>
                                        <Button
                                            variant={completed[lesson._id] ? 'success' : 'secondary'}
                                            size="md"
                                            onClick={() => toggleCompletion(lesson)}
                                        >
                                            {completed[lesson._id] ? 'Tamamlandı' : 'Tamamla'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>

            {console.log(currentLesson)}

            <PopUpModal show={showModal} handleClose={() => setShowModal(false)} title={currentLesson.title} Content={() => { return <p>{currentLesson.content}</p> }} fullscreen={true} />

        </Container>
    );
};