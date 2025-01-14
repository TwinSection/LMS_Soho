import { useEffect, useState } from "react";
import FetchQuery from "../FetchQuery";
import { Button, Card, Col, Row, Table, Modal } from "react-bootstrap";
import { AdminPages } from "../App";
import { useLocation, useNavigate, useParams } from "react-router";
import CategoryEditAndNew from "./CategoryEditAndNew";
import PopUpModal from "../PopUpModal";

export default function AllCategories() {

    let [datas, setDatas] = useState([]);
    let nav = useNavigate();
    let loc = useLocation();
    let params = useParams();
    let IsNewCategoryPage = loc.pathname.endsWith("/new");
    let IsEditCategoryPage = params?.id ? true : false;

    useEffect(() => {
        FetchQuery.Admin.GetCategories().then((x) => {
            console.log(x);
            if (x.data) {
                setDatas(x.data);
            }
        });
    }, [loc]);

    return <>
        {
            (IsNewCategoryPage || IsEditCategoryPage) && <>
                <PopUpModal
                    title={IsEditCategoryPage ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
                    show={IsEditCategoryPage || IsNewCategoryPage}
                    handleClose={() => { nav(AdminPages.Category); }}
                    Content={CategoryEditAndNew}
                />
            </>
        }
        <Row className="my-4">
            <Col>
                <h1>Tüm Kategoriler</h1>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col>
                <Button variant="primary" onClick={(e) => { e.preventDefault(); nav(AdminPages.Category + "/new") }} >Yeni Kategori Ekle</Button>
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
                                        <th>Kategori Adı</th>
                                        <th>Aksiyon</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Array.isArray(datas) ? datas : []).map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item?.CategoryName}</td>
                                            <td><Button variant="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    let link = AdminPages.Category + "/" + item._id;
                                                    console.log(link);
                                                    nav(link);
                                                }}
                                            >Düzenle</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) :
                        (
                            <h3>Veritabanında kategori bulunamadı.</h3>
                        )
                }

            </Col>
        </Row>

    </>
}