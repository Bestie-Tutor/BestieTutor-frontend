import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { LanguageContext } from "../LanguageContext";
import { UserContext } from "../UserContext";
import IMAGES from "../images/images";
import axios from '../axiosConfig'; 
import '../App.css';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [allLanguages, setAllLanguages] = useState([]);
  const username = userInfo?.email;
  const navigate = useNavigate();

  const getAllLanguages = async () => {
    try{
      const response = await axios.get('/conversation/getAllLanguages');
      if (response.status === 200) {
        setAllLanguages(response.data.languages);
      }
    } catch (error) {
      // console.error("Failed to fetch Languages:", error);
    }
  }

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/topic/');
      if (response.status === 200) {
        setTopics(response.data);
      }
    } catch (error) {
      // console.error("Failed to fetch topics:", error);
    }
  };

  // LanguageContext를 최근 대화 언어로 설정
  const getRecentLanguage = async () => {
    try {
        const userEmail = userInfo?.email;
        const response = await axios.get(`/conversation/getRecentLanguage/${userEmail}`);
        if (response.status === 200) {
          switch (response.data.conversation.selected_language) {
            case 'English':
              setUserLanguage("en");
              break;
            case 'Korean':
              setUserLanguage("ko");
              break;
            default:
              setUserLanguage("en");
              break;
          }
        } else {
          // 최근 대화가 없으면 선호도 조사 언어로 설정
            const userId = userInfo?.userId;
            const response = await axios.get(`/preference/${userId}`);
            switch (response.data.preferences.language) {
              case 'English':
                setUserLanguage("en");
                break;
              case '한국어':
                setUserLanguage("ko");
                break;
              default:
                setUserLanguage("en");
                break;
            }
        }
    } catch (error) {
        // console.error('Error fetching RecentLanguage:', error);
    }
  };

  useEffect(() => {
    fetchTopics();
    getAllLanguages();
    getRecentLanguage();
  }, []);

  useEffect(() => {
    if (!userInfo) {
      alert("로그아웃 상태이므로 초기화면으로 이동합니다.");
      navigate('/');
    }
  }, [userInfo, navigate]);

  const logout = async () => {
    await axios.post("/user/logout");
    setUserInfo(null); 
  };

  const handleMouseEnter = (topic) => {
    setCurrentTopic(topic); 
    setShowDropdown(true); 
  };

  const handleMouseLeave = () => {
    setCurrentTopic(null); 
    setShowDropdown(false);
  }

  const handleSubtopicClick = (mainTopic, subTopicName) => {
    navigate('/subtopic', { state: { selectedTopic: mainTopic, subTopic: subTopicName } });
  };

  const handleLanguageChange = (language) => {
    setUserLanguage(language); 
  };

  const selectedLanguage = userLanguage === "ko" ? '한국어' : 'English';

  return (
    <div className="header">
      <div className="header-top">
        <div className="header-left">
          <Link to="/home" className="header-title">Bestie Tutor</Link>
          <div className="header-links">
            <Link to="/about">소개</Link>
            <Link to="/notice">공지</Link>
            <Link to="/events">이벤트</Link>
          </div>
        </div>
        <div className="header-right">
          <div className="header-language">
          <div className="lang-dropdown">
            <button className="lang-dropdown-button">
              <img src={IMAGES.global} alt="global" className="globalimg" />
              <p>{selectedLanguage}</p>
            </button>
            <div className="lang-dropdown-menu">
            {allLanguages.map((language, index) => (
              <p 
                key={index}
                onClick={() => handleLanguageChange(language.code)}
              >
                {language.name === "English" ? language.name : "한국어"}
              </p>
            ))}
            </div>
          </div>
        </div>
          <div className="header-mypage">
            {username ? (
              <>
                <button onClick={logout} className="logout-button">로그아웃</button>
                <Link to="/mypage"><img src={IMAGES.mypage} alt="mypage" className="mypageimg" /></Link>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="header-content">
        {topics.map((topic) => (
          <div
            key={topic._id}
            className={`header-item ${
              currentTopic
                ? currentTopic.mainTopic === topic.mainTopic
                  ? "active"
                  : "inactive"
                : ""
            }`}
            onMouseEnter={() => {
              handleMouseEnter(topic)
            }}
          >
          {topic.mainTopic}
        </div>
          ))}

      {showDropdown && currentTopic && (
              <div className="dropdown-container" 
              onMouseEnter={() => setShowDropdown(true)} // 드롭다운 유지
              onMouseLeave={handleMouseLeave} // 드롭다운 숨기기
              >
                <div className="dropdown-content">
                {currentTopic.subTopics.map((subTopic) => (
                  <p
                    key={subTopic.name}
                    onClick={() => handleSubtopicClick(currentTopic.mainTopic, subTopic.name)}
                    className="dropdown-subtopic"
                  >
                    {subTopic.name}
                  </p>
                ))}
                </div>
              </div>
            )}
      </div>
    </div>
  );
}