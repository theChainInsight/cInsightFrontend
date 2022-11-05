import {
  Avatar,
  Button,
  Comment as AntdComment,
  Form,
  List,
  Tooltip,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Comment, CommentForm } from "entities/comment";
import React, { createElement, useEffect, useState } from "react";
import { useEffectSkipFirst, useForm } from "utils/hooks";
import { usePostCommentApi } from "api/comment";
import { ApiSet } from "utils/network/api_hooks";
import { LectureResponse } from "api/lecture";
import { useParams } from "react-router";
import moment from "moment";
import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from "@ant-design/icons";
import { fetchAccountImageUrl, addFavos } from "api/fetch_sol/sbt";
import { getCurrentAccountAddress } from "api/fetch_sol/utils";
import { useFetchUserApi } from "api/user";

export type EditorProps = {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
};

const Editor = ({ onChange, onSubmit, submitting, value }: EditorProps) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

export type LectureCommentsListProps = {
  lectureApi: ApiSet<LectureResponse> & { execute: (id: number) => void };
};

export const LectureCommetnsList = (props: LectureCommentsListProps) => {
  const postCommentApi = usePostCommentApi();
  const userApi = useFetchUserApi();
  const params = useParams<{ id: string }>();
  const commentForm = useForm<CommentForm>({ lectureId: params.id });
  const [comments, setComments] = useState<Comment[]>(
    props.lectureApi.response.lecture.comments ?? []
  );
  const [account, setAccount] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => (setAccount(await getCurrentAccountAddress())))()
  }, [])

  useEffectSkipFirst(() => {
    if (account !== undefined) {
      // userApi.execute(account)
      commentForm.updateObject("commenterEoa", account);
    }
  }, [account])

  // useEffectSkipFirst(() => {
  //   if (userApi.isSuccess()) {
  //     commentForm.updateObject("commenterEoa", userApi.response.user.eoa);
  //   }
  // }, [userApi.loading])

  useEffectSkipFirst(() => {
    if (postCommentApi.isSuccess()) {
      props.lectureApi.execute(Number(props.lectureApi.response.lecture.id));
    }
  }, [postCommentApi.loading]);

  return (
    <>
      {!!comments.length && (
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(item: Comment) => {
            const action =
              Number(item.id) % 3 === 0
                ? "liked"
                : Number(item.id) % 3 === 1
                  ? "disliked"
                  : undefined;
            return (
              <li>
                <AntdComment
                  actions={[
                    <Tooltip key="comment-basic-like" title="Like">
                      <span
                        onClick={() => {
                          addFavos(item.commenterEoa, 1);
                        }}
                      >
                        {action === "liked" ? (
                          <LikeFilled
                            style={{
                              verticalAlign: "middle",
                            }}
                          />
                        ) : (
                          <LikeOutlined
                            style={{
                              verticalAlign: "middle",
                            }}
                          />
                        )}
                        <span className="comment-action">{3}</span>
                      </span>
                    </Tooltip>,
                    // <Tooltip key="comment-basic-dislike" title="Dislike">
                    //   <span
                    //     onClick={() => {
                    //       // 何かの処理
                    //     }}
                    //   >
                    //     {action === "disliked" ? (
                    //       <DislikeFilled
                    //         style={{
                    //           verticalAlign: "middle",
                    //         }}
                    //       />
                    //     ) : (
                    //       <DislikeOutlined
                    //         style={{
                    //           verticalAlign: "middle",
                    //         }}
                    //       />
                    //     )}
                    //     <span className="comment-action">{1}</span>
                    //   </span>
                    // </Tooltip>,
                    <span key="comment-basic-reply-to">Reply to</span>,
                  ]}
                  author={item.commenter?.eoa}
                  avatar={
                    <Avatar
                      // src={fetchAccountImageUrl(item.commenterEoa)} // null
                      src={""} // null
                      alt="Han Solo"
                    />
                  }
                  content={item.content}
                  datetime={moment(item.createdAt).fromNow()}
                />
              </li>
            );
          }}
        />
      )}
      <AntdComment
        avatar={
          // <Avatar src={fetchAccountImageUrl(} alt="Han Solo" />
          <Avatar src={"https://thechaininsight.github.io/img/0/1.gif"} alt="Han Solo" />
        }
        content={
          <Editor
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              commentForm.updateObject("content", e.target.value);
            }}
            onSubmit={() => {
              postCommentApi.execute(commentForm);
            }}
            submitting={postCommentApi.loading}
            value={commentForm.object.content ?? ""}
          />
        }
      />
    </>
  );
};
