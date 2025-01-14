import { useEffect, useState } from "react";
import FetchQuery from "../FetchQuery";
import { Button, Card, Col, Row, Table, Modal } from "react-bootstrap";
import { InstructorPages, Pages } from "../App";
import { useLocation, useNavigate, useParams } from "react-router";
import InstructorCourseEditAndNew from "./InstructorCourseEditAndNew";
import PopUpModal from "../PopUpModal";
import { useUserContext } from "../context/UserContext";

export default function InstructorCourses() {

    let [datas, setDatas] = useState([]);
    let nav = useNavigate();
    let loc = useLocation();
    let params = useParams();
    let IsEditCoursePage = params?.id ? true : false;
    let {user} = useUserContext();

    useEffect(() => {
        FetchQuery.GetCourses().then((x) => {
            if (x.data) {
                setDatas(x.data);
                console.log(x.data);
            }
        });

    }, []);

    return <>
        {
            (IsEditCoursePage) && <>
                <PopUpModal
                    title={"Eğitim Düzenle"}
                    show={IsEditCoursePage}
                    handleClose={() => { nav(InstructorPages.MyCourses); }}
                    Content={InstructorCourseEditAndNew}
                    fullscreen={true}
                />
            </>
        }
        <Row className="my-4">
            <Col>
                <h1>Tüm Eğitimler</h1>
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
                                        <th>Kullanıcı Sayısı</th>
                                        <th>Ders Sayısı</th>
                                        <th>Aksiyon</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(datas) ? datas : []).map((item, index) => {
                                        if(item?.Instructor._id.toString() === user.user._id.toString())
                                            return <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.Title}</td>
                                                    <td>{item?.Category?.CategoryName ?? "-"}</td>
                                                    <td>{Array.isArray(item?.EnrolledUsers) ? item.EnrolledUsers.length : 0}</td>
                                                    <td>{Array.isArray(item?.LessonList) ? item.LessonList.length : 0}</td>
                                                    <td><Button variant="primary"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            let link = InstructorPages.MyCourses + "/" + item._id;
                                                            nav(link);
                                                        }}
                                                    >Düzenle</Button></td>
                                                </tr>
                                    })}
                                </tbody>
                            </Table>
                        ) :
                        (
                            <h3>Size kayıtlı bir eğitim bulunamadı.</h3>
                        )
                }

            </Col>
        </Row>

    </>
}