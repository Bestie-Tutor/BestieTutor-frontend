import GoBack from '../components/GoBack';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import IMAGES from "../images/images";

export default function PreferredTopic() {
    const navigate = useNavigate();
    const location = useLocation();
    const { language, goals, level } = location.state;
    
    const [user, setUser] = useState(null);
    const [topics, setTopics] = useState([]); // 백엔드에서 받아올 주제 목록
    const [selectedTopics, setSelectedTopics] = useState([]);
    
    // 주제를 백엔드에서 가져오는 함수
    const fetchTopics = async () => {
        const response = await axios.get('/topic/'); // API 호출
        if (response.status === 200) {
            setTopics(response.data); // 주제 목록 상태에 저장
        }
        else {
            console.error("주제 목록을 불러오는데 실패했습니다.", response.status);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get('/user/getUserInfo', {
                withCredentials: true, // 쿠키 자동 포함
            });
        if (response.status === 201) {
            setUser(response.data.userInfo);
        } else {
            console.error("userId 불러오는데 실패했습니다.", response.status);
        }
        } catch (error) {
        console.error("API 호출 오류:", error);
        }
    };
    
    useEffect(() => {
        fetchTopics(); // 컴포넌트가 마운트될 때 주제 목록을 불러옴
        fetchUser(); 
    }, []);
    
    const handleNextSurvey = async () => {
        // 목표 중복 선택 가능
        if (selectedTopics.length >= 1 && selectedTopics.length <= 3) {
            const result = await preference();
            // 성공적으로 설문이 완료되었는지 확인
            if (result && result.message === '선호도 조사 완료') {
                navigate('/home'); 
            } else {
                console.error("선호도 조사에 문제가 발생했습니다.");
            }
        }
    };

    async function preference() {
        const userData = {
            userId: user.userId, 
            language: language,
            learningGoals: goals,
            preferredTopics: selectedTopics,
            currentSkillLevel: level
        };
    
        const response = await axios.post('/preference', userData); 
        return response.data;
      }

    const handleTopicClick = (topic) => {
        setSelectedTopics((prev) => {
            if(prev.includes(topic)){
                //목표가 이미 선택된 경우, 선택 해제
                return prev.filter((item) => item !== topic);
            } else if (prev.length < 3){
                return [...prev, topic];
            }
            return prev;
        });
    };

    return (
        <div className="topic">

            <GoBack className='topic-goBack'/> 
            <p className="conversation-title">선호하는 주제를 선택해주세요
            <span style={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.36)' }}>
                (최대 3개)
            </span>
            </p>

            <div className='character-wrapper'>
                <div className="goal-list">
                    {topics.map((topic) => (
                    <div 
                        key={topic._id}
                        className='preferredTopic-item' 
                        // style={{ backgroundColor: selectedTopics.includes(topic.mainTopic) ? '#b8f0d2' : 'rgba(0, 0, 0, 0.02)' }} 
                        style={{ backgroundColor: selectedTopics.includes(topic.mainTopic) ? '#4ED8B7' : '#EBFFEE' }}
                        onClick={() => handleTopicClick(topic.mainTopic)}
                    >
                        <img src={IMAGES[topic.mainTopic]} alt={topic.mainTopic} className="preferredTopic-icon" />
                        <p className="goal-text">{topic.mainTopic}</p>
                    </div>
                    ))}
                </div>
            </div>
            {/* Start Learning Button*/}
            <button 
                className="next-button" 
                onClick={handleNextSurvey}
            >
                다음
            </button>
        </div>
    );
};
