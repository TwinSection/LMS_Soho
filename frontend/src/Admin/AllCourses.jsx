import { useEffect, useState } from "react";
import FetchQuery from "../FetchQuery";
import { Button, Card, Col, Row, Table, Modal } from "react-bootstrap";
import { AdminPages } from "../App";
import { useLocation, useNavigate, useParams } from "react-router";
import CourseEditAndNew from "./CourseEditAndNew";
import PopUpModal from "../PopUpModal";

export default function AllCourses() {

    let [datas, setDatas] = useState([]);
    let nav = useNavigate();
    let loc = useLocation();
    let params = useParams();
    let IsNewCoursePage = loc.pathname.endsWith("/new");
    let IsEditCoursePage = params?.id ? true : false;

    useEffect(() => {
        FetchQuery.Admin.GetCourses().then((x) => {
            if (x.data) {
                setDatas(x.data);
            }
        });

    }, []);

    return <>
        {
            (IsNewCoursePage || IsEditCoursePage) && <>
                <PopUpModal
                    title={IsEditCoursePage ? "Eğitim Düzenle" : "Yeni Eğitim Ekle"}
                    show={IsEditCoursePage || IsNewCoursePage}
                    handleClose={() => { nav(AdminPages.Courses); }}
                    Content={CourseEditAndNew}
                    fullscreen={true}
                />
            </>
        }
        <Row className="my-4">
            <Col>
                <h1>Tüm Eğitimler</h1>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
                <Button variant="primary" onClick={(e) => { e.preventDefault(); nav(AdminPages.Courses + "/new") }} >Yeni Eğitim Ekle</Button>
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
                                        <th>Eğitim Adı</th>
                                        <th>Kategori</th>
                                        <th>Eğitmen</th>
                                        <th>Kullanıcı Sayısı</th>
                                        <th>Ders Sayısı</th>
                                        <th>Aksiyon</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(datas) ? datas : []).map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item?.Title}</td>
                                            <td>{item?.Category?.CategoryName ?? "-"}</td>
                                            <td>{item?.Instructor ?? "-"}</td>
                                            <td>{Array.isArray(item?.EnrolledUsers) ? item.EnrolledUsers.length : 0}</td>
                                            <td>{Array.isArray(item?.LessonList) ? item.LessonList.length : 0}</td>
                                            <td><Button variant="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    let link = AdminPages.Courses + "/" + item._id;
                                                    nav(link);
                                                }}
                                            >Düzenle</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) :
                        (
                            <h3>Veritabanında eğitim bulunamadı.</h3>
                        )
                }

            </Col>
        </Row>

    </>
}