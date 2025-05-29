import React from "react";
import Header from "../../components/Common/Header";
import { Button } from "../../components/Common/Button";
import FormInput from "../../components/Common/FormInput";

export default function TestPage(){
    return (
        <div>
            <Header/>
            <p>이곳은 테스트 페이지 입니다.</p>
            <Button className="bg-purple-500 text-white hover:bg-purple-600">클릭하세요</Button>
            <FormInput className="w-64 h-10"/>
        </div>
    );
}