import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { styled } from "styled-components";
import BusanBg from "../../../assets/busan_background.png";
import { EditOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useI18n } from "../../../hooks/useI18n"

const UserStateWrapper = styled.div`
  background-image: linear-gradient(
      rgba(20, 56, 94, 0.477),
      rgba(184, 218, 255, 0.2)
    ),
    url(${BusanBg});
  border-radius: 5px;
`;
const UserInfoWrapper = styled.div`
  background-color: #fff;
  border-radius: 5px;
  height: 100%;
  padding: 25px;
`;
const UserInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const UserInfoContent = styled.div`
  padding-left: 15px;
  text-align: left;
  margin: 15px 0;
  & p:nth-child(1) {
    color: #1983ff;
    font-weight: 600;
  }

  & p:nth-child(2) {
    font-size: 16px;
  }
`;

const UserInfo = ({ userInfoData, isMe }) => {
  const t = useI18n()
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://busanwavrserver.store/user/tour/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          const endedTours = data.data.endedTours;
          // TODO - 종료 일자받아와서 총 투어 시간 계산하기
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/update");
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <UserStateWrapper className="w-full md:w-1/2"></UserStateWrapper>
      <div className="w-full md:w-1/2 md:pl-6">
        <UserInfoWrapper>
          <UserInfoHeader>
            <p className="font-bold">{t(`회원 정보`)}</p>
            {isMe ? (
              <Tooltip title="회원 정보 수정">
                <Button
                  type="link"
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={handleClick}
                />
              </Tooltip>
            ) : (
              <></>
            )}
          </UserInfoHeader>
          <UserInfoContent>
            <p>{t(`이메일`)}</p>
            <p>{userInfoData.email}</p>
          </UserInfoContent>
          <UserInfoContent>
            <p>{t(`닉네임`)}</p>
            <p>{userInfoData.nickname}</p>
          </UserInfoContent>
          <UserInfoContent>
            <p>{t(`관심 카테고리`)}</p>
            <p>{userInfoData.categories.join(", ")}</p>
          </UserInfoContent>
        </UserInfoWrapper>
      </div>
    </div>
  );
};

export default UserInfo;
