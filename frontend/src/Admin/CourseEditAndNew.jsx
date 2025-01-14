import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import FetchQuery from "../FetchQuery";
import { AdminPages } from "../App";

export default function CourseEditAndNew() {

    let nav = useNavigate();
    let params = useParams();
    let loc = useLocation();
    let IsNewCoursePage = loc.pathname.endsWith("/new");

    let [course, setCourse] = useState({
        Title: "",
        Description: "",
        Category: {},
        Instructor: {},
        CreatedAt: "",
        EnrolledUsers: "",
        LessonList: ""
    });

    let [allInstructor, setAllInstructor] = useState({
        Username: ""
    });

    let [allCategories, setAllCategories] = useState({
        CategoryName: ""
    });

    let [currentLessons, setCurrentLessons] = useState({
        Title: "",
        Description: "",
        Content: ""
    });

    useEffect(() => {
        if (!IsNewCoursePage && params.id) {
            FetchQuery.Admin.GetCourses(undefined, params.id).then((x) => {
                console.log(x);
                setCourse(x.data[0])
                setCurrentLessons(x.data[0].LessonList)
            });
        }

        FetchQuery.Admin.GetUsers(undefined).then((x) => {
            const egitmenler = x.data.filter(user => user.Role === "Egitmen");
            if(course.Instructor?._id == null && egitmenler.length > 0){
                course.Instructor = {
                    _id : egitmenler[0]._id
                }
            }
            return egitmenler;
        }).then((egitmenler) => {
            FetchQuery.Admin.GetCategories(undefined).then((x) => {
                console.log("course", course);
                if(course.Category?._id == null && x.data.length > 0){
                    course.Category = {
                        _id : x.data[0]._id
                    }
                    setCourse(course);
                }
                setAllCategories(x.data)
                setAllInstructor(egitmenler);
            })
        }); 

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
        newData.CreatedAt = Date.now();
        newData.CategoryID = newData.Category._id;
        newData.InstructorID = newData.Instructor._id;
        newData.LessonList = lessonRows ?? [];

        if (IsNewCoursePage) delete newData._id;

        (!IsNewCoursePage ? FetchQuery.Admin.ModifyCourse : FetchQuery.Admin.CreateCourse)(undefined, newData).then((x) => {
            if (x.data) {
                setCourse(x.data);
                nav(AdminPages.Courses);
            } else {
                alert(x.message);
            }
        }).catch((error) => {
            console.log(error);
        });

    }

    function isFormFilled() {
        return course.Title.length > 0 && allCategories != null && allCategories.length != 0 && course.Category != null && course.Category != undefined;
    }

    return <>
        <div className="p-2">
            <Row className="mb-3">
                <Col>
                    <Form >
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Eğitim Adı:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Title"
                                        placeholder="Eğitim adını giriniz"
                                        value={course.Title}
                                        onChange={(e) => { isFormFilled(); setCourse({ ...course, Title: e.target.value }) }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Açıklama:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Description"
                                        placeholder="Açıklama giriniz"
                                        value={course.Description}
                                        onChange={(e) => { setCourse({ ...course, Description: e.target.value }) }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kategori:</Form.Label>
                                    <Form.Select
                                        name="Category"
                                        value={course.Category == undefined ? 0 : course.Category._id}
                                        onChange={(e) => { setCourse({ ...course, Category: { _id : e.target.value } }) }}
                                        disabled={!allCategories || allCategories.length === 0}
                                    >
                                        {allCategories && allCategories.length > 0 ? (
                                            allCategories.map((category, index) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.CategoryName}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">Yükleniyor...</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Eğitmen:</Form.Label>
                                    <Form.Select
                                        name="Instructor"
                                        value={course.Instructor?._id == null ? (allInstructor[0]?._id ?? 0) : course.Instructor._id}
                                        onChange={(e) => { setCourse({ ...course, Instructor: {_id : e.target.value} }) }}
                                        disabled={!allInstructor || allInstructor.length === 0}
                                    >
                                        {allInstructor && allInstructor.length > 0 ? (
                                            allInstructor.map((instructor, index) => (
                                                <option key={instructor._id} value={instructor._id}>
                                                    {instructor.Username + " (" + instructor.Name + " " + instructor.Surname + ")"}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">Yükleniyor...</option>
                                        )}
                                    </Form.Select>
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
                                                console.log(row);
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
                                onClick={SaveCourse} disabled={!isFormFilled()}>
                                Kaydet
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>

    </>
}