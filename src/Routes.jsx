import { Routes, Route } from "react-router-dom";
import { Start, UserAgreement, Register, Login, Home, FindPw, Conversation, RegistrationSuccess, Topic, SubTopic, ChooseCharacter } from "./pages";

export default function AppRoutes() {
    return(
        <Routes>
            {/* Route: 컴포넌트 별로 원하는 url을 지정 */}
            <Route path="/" element={<Start />} />
            <Route path="/userAgreement" element={<UserAgreement />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/findpw" element={<FindPw />} />
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/registrationSuccess" element={<RegistrationSuccess />} />
            <Route path="/topic" element={<Topic />} />
            <Route path="/subtopic" element={<SubTopic />} />
            <Route path="/chooseCharacter" element={<ChooseCharacter />} />
        </Routes>
    );
}

