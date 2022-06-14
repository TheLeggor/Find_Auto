import React, { useEffect, useState } from "react";
import {FormControl, Button, Container, Modal, Form, Figure, Card} from "react-bootstrap";
import delBtn from "../../../images/del.png";
import acceptBtn from "../../../images/check-png.png";
import axios from "axios";
import {useHistory, useLocation, useParams} from "react-router-dom";
//import {Button} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PostCreateForm from "./PostCreateForm";
import PostEditForm from "./PostEditForm";

const PostPage = ({ userData, updateAllPosts }) => {
    const { state: postData } = useLocation();
    const [bookmarkId, setBookmarkId] = useState('');
    const [bookmarked, setBookmarked] = useState(false);
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [resultSuccesful, setResultSuccesful] = useState(true);

    const { t } = useTranslation();

    const history = useHistory();

    const handleShowEditPostModal = () => setShowEditPostModal(true);
    const handleCloseEditPostModal = () => setShowEditPostModal(false);

    const handleShowResultModal = () => setShowResultModal(true);
    const handleCloseResultModal = () => {
        if (resultSuccesful) history.push("/posts");
        setShowResultModal(false);
    };

    const handleShowConfirmModal = () => setShowConfirmModal(true);
    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    const getBookmark = () => {
        axios({
            method: "get",
            headers: {
                Authorization: "JWT " + localStorage.getItem("login_token"),
            },
            data: {
                'user_id': userData.user_id,
                'post_id': postData.post_id,
            },
            url:
                process.env.REACT_APP_LINK +
                process.env.REACT_APP_BOOKMARKS
        })
            .then((res) => {
                //TODO если есть в закладках - то возвращается тру ну и там понятно уже
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deletePost = () => {
        axios({
            method: "delete",
            headers: {
                Authorization: "JWT " + localStorage.getItem("login_token"),
            },
            url:
                process.env.REACT_APP_LINK +
                process.env.REACT_APP_POSTS +
                postData.pk +
                "/",
        })
            .then((res) => {
                console.log(res, "delete post");
                if (res.status === 204)
                    setResultSuccesful(true);

                handleShowResultModal();

                //showResultModal()
            })
            .catch((err) => {
                setResultSuccesful(false)
                handleShowResultModal();
                console.log(err);
            });
    };

    const makeBookmark = () =>{
        axios({
            method: "post",
            headers: {
                Authorization: "JWT " + localStorage.getItem("login_token"),
            },
            data: {
                'user_id': userData.userId,
                'post_id': postData.pk,
            },
            url:
                process.env.REACT_APP_LINK +
                process.env.REACT_APP_BOOKMARKS
        })
            .then((res) => {
                console.log(res.data, "qweqwe");
                setBookmarkId(res.data.pk)
                setBookmarked(true)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const deleteBookmark = () =>{
        axios({
            method: "delete",
            headers: {
                Authorization: "JWT " + localStorage.getItem("login_token"),
            },
            url:
                process.env.REACT_APP_LINK +
                process.env.REACT_APP_BOOKMARKS +
                bookmarkId +
                "/",
        })
            .then((res) => {
                setBookmarked(false)
            })
            .catch((err) => {
                console.log(err);
            });
    }
    //if(userData.userId==postData.user_id) return 'kurwa matj';
    //TODO vivod dannyx {JSON.stringify(postData)}
    return (
        <Container className={"post-page"}>


            <Figure>
                <Figure.Image
                    width={500}
                    height={500}
                    alt="500x500"

                    src={postData.uploads && postData.uploads[0] && postData.uploads[0].image
                        ? `${process.env.REACT_APP_LINK}${postData.uploads[0].image.slice(1)}`
                        : 'https://bytes.ua/wp-content/uploads/2017/08/no-image.png'}
                />
            </Figure>

            <h1>{postData.name}</h1>

            {<h4>
                {postData.is_search
                    ? t('post.status_search')
                    : t('post.status_found')}
            </h4>}

            {(postData.registration_number || postData.registration_number !== '') && <h4>
                {t('post.registration_number')}: {postData.registration_number}
            </h4>}

            {(postData.brand || postData.brand !== '') && <h4>
                {t('post.brand')}: {postData.brand}
            </h4>}

            {(postData.model || postData.model !== '') && <h4>
                {t('post.model')}: {postData.model}
            </h4>}

            {(postData.year || postData.year !== '') && <h4>
                {t('post.year')}: {postData.year}
            </h4>}

            <h4>Color: {(postData.color || postData.color !== '') &&
            <Container style={{background:postData.color}} className={"post-card-body-color"}/>}
            </h4>
    
            {(postData.vehicle_seen_place || postData.vehicle_seen_place !== '') && <h4>
                {t('post.vehicle_seen_place')}: {postData.vehicle_seen_place}
            </h4>}

            {(postData.vehicle_seen_date || postData.vehicle_seen_date !== '') && <h4>
                {t('post.vehicle_seen_date')}: {postData.vehicle_seen_date}
            </h4>}

            {(postData.info || postData.info !== '') && <h4>
                {t('post.info')}: {postData.info}
            </h4>}

            {(postData.vin_code || postData.vin_code !== '') && <h4>
                {t('post.vin_code')}: {postData.vin_code}
            </h4>}

            {(postData.distinct_feature || postData.distinct_feature !== '') && <h4>
                {t('post.distinct_feature')}: {postData.distinct_feature}
            </h4>}

            {bookmarked
                ? <Button variant="primary" onClick={deleteBookmark}>
                    {t("post.delete_bookmark")}
                </Button>
                : <Button variant="primary" onClick={makeBookmark}>
                    {t("post.make_bookmark")}
                </Button>}

            {/*<Button variant="primary" onClick={makeBookmark}>*/}
            {/*    {t("post.make_bookmark")}*/}
            {/*</Button>*/}

            <br/><br/>
            {userData.userId == postData.user_id && (
                <>
                    <Button variant="primary" onClick={handleShowEditPostModal}>
                        {t("post.edit_post")}
                    </Button>
                    <PostEditForm
                        show={showEditPostModal}
                        userData={userData}
                        postData={postData}
                        handleClose={handleCloseEditPostModal}
                        updateAllPosts={updateAllPosts}
                    />

                    <Button
                        variant="primary"
                        onClick={() => {
                            handleShowConfirmModal();
                        }}
                    >
                        {t("post.delete_post")}
                    </Button>

                    <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("confirmation")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {t("deleting")}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    deletePost();
                                    handleCloseConfirmModal();
                                }}
                            >
                                {t("accept")}
                            </Button>
                            <Button variant="secondary" onClick={handleCloseConfirmModal}>
                                {t("close")}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showResultModal} onHide={handleCloseResultModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {resultSuccesful
                                    ? t("deleted")
                                    : t("deleted_fail")}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseResultModal}>
                                {t("close")}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </Container>
    );
};

export default PostPage;
