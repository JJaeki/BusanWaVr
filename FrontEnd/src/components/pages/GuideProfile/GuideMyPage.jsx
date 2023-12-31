import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import GuideNavbar from "./GuideNavbar";
import GuideMini from "./GuideMini";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import { toast } from "react-toastify";

const { Content, Sider } = Layout;

function GuideMyPage() {
  const [collapsed, setCollapsed] = useState(false);

  const { userId } = useSelector((state) => state.userInfo);
  const { urlId } = useParams();
  const url = `https://busanwavrserver.store/guide/guideInfo/${urlId}`;
  const [guideInfoData, setGuideInfoData] = useState(null);
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    if (userId == urlId) {
      setIsMe(true);
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setGuideInfoData(data.data);
        } else {
          toast.error(
            "유저데이터를 받아올 수 없습니다. 잠시 후 다시 시도해 주세요."
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [urlId]);

  return (
    <Layout style={{ height: "calc(100vh - 5rem )" }}>
      <Sider
        style={{ height: "calc(100vh - 5rem )" }}
        theme="light"
        breakpoint="lg"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <GuideMini
          userInfoData={guideInfoData}
          collapsed={collapsed}
          isMe={isMe}
        />
        <GuideNavbar />
      </Sider>
      <Layout style={{ height: "calc(100vh - 4.3rem)", overflowY: "scroll" }}>
        <Content style={{ margin: "0 16px" }}>
          <Outlet context={{ guideInfoData, isMe }} />
        </Content>
      </Layout>
    </Layout>
  );
}

export default GuideMyPage;
