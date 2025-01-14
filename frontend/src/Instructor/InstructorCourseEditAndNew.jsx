import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FetchQuery from "../FetchQuery";
import { InstructorPages } from "../App";
import PopUpModal from "../PopUpModal";

export default function InstructorCourseEditAndNew() {

    let nav = useNavigate();
    let params = useParams();

    let [course, setCourse] = useState({
        Title: "",
        Description: "",
        Category: {},
        Instructor: {},
        CreatedAt: "",
        EnrolledUsers: "",
        LessonList: ""
    });

    let [currentLessons, setCurrentLessons] = useState({
        Title: "",
        Description: "",
        Content: ""
    });

    useEffect(() => {
        if (params.id) {
            FetchQuery.Instructor.GetCourse(undefined, params.id).then((x) => {
                console.log("Course : ", x);
                setCourse(x.data[0])
                setCurrentLessons(x.data[0].LessonList)
            });
        }

    }, []);

    let [lessonRows, setLessonRows] = useState([]);

    useEffect(() => {
        if (currentLessons && currentLessons.length > 0) {
            const initialRows = currentLessons.map((lesson, index) => ({
                _id: lesson._id,
                Title: lesson.Title,
                Description: lesson.Description,
                Content: lesson.Content,
                CreatedAt: lesson.CreatedAt,
            }));
            setLessonRows(initialRows);
        }
    }, [currentLessons]);

    const AddLessonRows = () => {
        lessonRows.push({
            _id: Date.now(),
            CreatedAt: Date.now(),
            Title: "Ders Adı",
            Description: "Ders Açıklaması",
            Content: "İçerik"
        });

        if (lessonRows && lessonRows.length > 0) {
            const initialRows = lessonRows.map((lesson, index) => ({
                _id: lesson._id,
                Title: lesson.Title,
                Description: lesson.Description,
                Content: lesson.Content,
                CreatedAt: lesson.CreatedAt,
            }));
            setCurrentLessons(initialRows);
        }

        setLessonRows(lessonRows);
    };

    const RemoveLessonRow = (id) => {
        lessonRows = lessonRows.filter((lessonRows) => lessonRows.CreatedAt !== id);

        let lessonTemp = currentLessons.find((lesson) => lesson._id === id);

        if (lessonTemp) {
            currentLessons = currentLessons.filter((lesson) => lesson._id !== id)

            FetchQuery.Admin.DeleteLesson(undefined, id).then((x) => {
                if (x.status) {
                    nav(0);
                    setCurrentLessons(currentLessons);
                    setLessonRows(currentLessons);
                } else {
                    alert(x.message);
                }
            }).catch((error) => {
                console.log(error);
            });
        }

        setLessonRows(lessonRows);
    };

    const HandleInputChange = (id, field, value) => {

        const updatedRows = lessonRows.map((lessonRow) => {
            if (lessonRow._id === id) {
                return { ...lessonRow, [field]: value };
            }
            return lessonRow;
        });

        setLessonRows(updatedRows);
    };

    function SaveCourse(e) {
        e.preventDefault();
        let newData = { ...course };
        newData.LessonList = lessonRows ?? [];

        (FetchQuery.Instructor.ModifyCourse)(undefined, newData).then((x) => {
            if (x.data) {
                setCourse(x.data);
                nav(InstructorPages.Courses);
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

                    <>
                        <Form >
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Eğitim Adı:</Form.Label>
                                        <Form.Label><br />{course.Title}</Form.Label>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Açıklama:</Form.Label>
                                        <Form.Label><br />{course.Description}</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Kategori:</Form.Label>
                                        <Form.Label><br />{course.Category.CategoryName}</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Eğitmen:</Form.Label>
                                        <Form.Label><br />{course.Instructor.Name}</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Dersler:</Form.Label>

                                        <Button onClick={AddLessonRows} className="my-3">
                                            Ders Ekle
                                        </Button>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Ders Adı</th>
                                                    <th>Açıklaması</th>
                                                    <th>Content</th>
                                                    <th>Aksiyon</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(lessonRows ?? []).map((row) => {
                                                    return (
                                                        <tr key={row._id}>
                                                            <td>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={row.Title}
                                                                    onChange={(e) =>
                                                                        HandleInputChange(row._id, "Title", e.target.value)
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={row.Description}
                                                                    onChange={(e) =>
                                                                        HandleInputChange(row._id, "Description", e.target.value)
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    rows={3}
                                                                    value={row.Content}
                                                                    onChange={(e) =>
                                                                        HandleInputChange(row._id, "Content", e.target.value)
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => RemoveLessonRow(row._id)}
                                                                >
                                                                    Sil
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="d-grid gap-2">
                                <Button variant="outline-primary" type="submit" className="w-100"
                                    onClick={SaveCourse}>
                                    Kaydet
                                </Button>
                            </div>
                        </Form>
                    </>

                </Col>
            </Row>
        </div>

    </>
}