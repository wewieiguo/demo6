import React, { useState, useRef } from 'react';
// styles
import "./FormFunction.css";
// component
import { Input, Button, message } from 'antd';
import { CloseOutlined } from "@ant-design/icons";
export default function FormFunction() {
    const inputRef = useRef(null)
    const [inputNum, setInputNum] = useState([]);//input的数量
    const [currentIndex, setCurrentIndex] = useState(-1);//当前input激活的index
    /**
     * 添加input
     */
    const addClick = async () => {
        const index = inputNum.length
        await setInputNum((prev) => {
            return [...prev, ""]
        })
        await setCurrentIndex(index);
        await inputRef.current && inputRef.current.focus()
    }
    /**
     * input获取焦点
     * @param {*} index input的下标
     */
    const inputOnFocus = (e, index) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentIndex(index)
    }
    /**
     * 按下回车的回调
     */
    const onPressEnter = (value) => {
        if (value.indexOf("=") === -1) {
            message.warning("请输入正确的值");
        } else {
            const newInputNum = inputNum.map((el, index) => {
                if (index === currentIndex) {
                    el = value
                }
                return el
            })
            setInputNum(newInputNum);
            setCurrentIndex(-1);
            inputRef.current && inputRef.current.blur()
        }
    }
    /**
     * 删除input
     */
    const deleteInput = (index) => {
        const newInputNum = inputNum.filter((el, ind) => index !== ind);//过滤掉标识相同的
        setInputNum(newInputNum);
    }
    /**
     * 查询
     */
    const searchClick = () => {
        let result = {};//声明一个存放输出结果的变量
        inputNum.forEach((el, index) => {
            const currentInput = el.split("=");//对每一项进行=分割
            result[currentInput[0]] = currentInput[1]//将每一项以key：value的形式存入result
        });
        console.log(result)
    }
    return (
        <section className={"container"}>
            <header className={"header"}>
                <span>自定义搜索选项：</span>
                {inputNum.length > 0 ? inputNum.map((elem, index) => {
                    return (
                        <section key={index} className={"input-container"}>
                            <Input
                                className={currentIndex === index ? "input-hover-style" : "input-style"}
                                placeholder="请输入key=value，回车确认"
                                onFocus={(e) => inputOnFocus(e, index)}
                                onBlur={() => setCurrentIndex(-1)}
                                ref={inputRef}
                                onPressEnter={(e) => {
                                    const value = e.target.value;
                                    onPressEnter(value)
                                }}
                                size={"small"}
                            />
                            {currentIndex !== index && (
                                <section className={"delete-icon-container"} onClick={() => deleteInput(index)}>
                                    <CloseOutlined className={"delete-icon"} />
                                </section>
                            )}
                        </section>
                    )
                }) : null}
                <Button type="dashed" onClick={addClick}>+添加</Button>
            </header>
            <footer className={"footer"}>
                <Button type="primary" onClick={searchClick}>查询</Button>
                <Button
                    onClick={() => {
                        setInputNum([])
                    }}
                >
                    清空
                </Button>
            </footer>
        </section >
    )
}
