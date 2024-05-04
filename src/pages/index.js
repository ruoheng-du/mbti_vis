import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css'
import { csv, json } from "d3";
import { Row, Col, Container } from "react-bootstrap";
import styles from "../styles/assignment5_styles.module.css";
import { AirportMap }  from "../components/airportMap";
import { BarChart } from "../components/barChart";
import { Heatmap } from "../components/heatmap";
import { PersonalityIncomeChart } from "../components/SalaryChart";

const distributionUrl = 'https://gist.githubusercontent.com/CreytonTNT/4274e1e9cacd3d47f1f585cceff4a9c9/raw/78f54402051329d204b96d2b1c3edfed84d3e3b5/MBTI_Country.csv';
const incomeUrl = 'https://gist.githubusercontent.com/CreytonTNT/3d5417d6e6f86b75b734a3a582be93a4/raw/8a68dd956906d289edc82cca4b81a990e87d1924/MBTI_Income.csv';
const zodiacUrl = 'https://gist.githubusercontent.com/CreytonTNT/3db168b7d1d6a6d76a78513ed97698d9/raw/e8e60e2ec58413a520d0f82e6e680e5335fffdc7/MBTI_Zodiac.csv';
const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';

function useDistribution(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.INTP = +d.INTP
                d.INFJ = +d.INFJ
                d.ISTJ = +d.ISTJ
                d.ESTP = +d.ESTP
                d.ENFJ = +d.ENFJ
                d.ISFJ = +d.ISFJ
                d.ENFP = +d.ENFP
                d.INFP = +d.INFP
                d.ESFJ = +d.ESFJ
                d.ESTJ = +d.ESTJ
                d.ISFP = +d.ISFP
                d.ENTJ = +d.ENTJ
                d.ESFP = +d.ESFP
                d.INTJ = +d.INTJ
                d.ISTP = +d.ISTP
                d.ENTP = +d.ENTP
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function useZodiac(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.Aquarius = +d.Aquarius;
                d.Aries = +d.Aries;
                d.Cancer = +d.Cancer;
                d.Capricorn = +d.Capricorn;
                d.Gemini = +d.Gemini;
                d.Leo = +d.Leo;
                d.Libra = +d.Libra;
                d.Pisces = +d.Pisces;
                d.Sagittarius = +d.Sagittarius;
                d.Scorpio = +d.Scorpio;
                d.Taurus = +d.Taurus;
                d.Virgo = +d.Virgo;
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function useIncome(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            setData(data);
        });
    }, []);
    return dataAll;
}

function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(geoJsonData => {
            setData(geoJsonData);
        })
    }, []);
    return data;
}

function MBTI(){
    const [clickedCountry, setClickedCountry] = useState(null);
    const [selectedPersonality, setSelectedPersonality] = useState(null);
    const [highlightedMBTI, setHighlightedMBTI] = useState(null);

    const barchart_width = 400;
    const barchart_height = 400;
    const barchart_margin = { top: 30, bottom: 35, left: 60, right: 10 };
    const barchart_inner_width = barchart_width - barchart_margin.left - barchart_margin.right;
    const barchart_inner_height = barchart_height - barchart_margin.top - barchart_margin.bottom;
    const map_width = 600;
    const map_height = 400;

    const map = useMap(mapUrl);
    const income = useIncome(incomeUrl);
    const distribution = useDistribution(distributionUrl);
    const zodiac = useZodiac(zodiacUrl);
    const [targetName,setTargetName]=useState(null);
    
    const handleCountryClick = (country) => {
        setClickedCountry(country);
    };

    if (!map || !distribution || !zodiac) {
        return <pre>Loading...</pre>;
    };

    return (<Container >
            <Row className={"justify-content-md-left"}>
                <Col lg={10} >
                    <h1 className={styles.h1Style}>Unlocking the Human Puzzle</h1> 
                    <p className={styles.paragraphStyle}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome to Unlocking the Human Puzzle!
                        The Myers-Briggs Type Indicator (MBTI) is a widely used personality assessment tool that categorizes
                        individuals into one of 16 personality types based on their preferences in four key dimensions: Extraversion (E)
                        vs. Introversion (I), Sensing (S) vs. Intuition (N), Thinking (T) vs. Feeling (F), Judging (J) vs. Perceiving (P).
                        MBTI is often used for personal development, career counseling, team-building, and understanding
                        interpersonal dynamics.
                    </p>
                    <p className={styles.paragraphStyle}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the following two views, you can explore the global distribution of different peronsality types.
                        A deeper saturation indicates this region has a higer proportion of the selected personality.
                        Also, by clicking a country or region, you can see what is the distribution of 16 peronsalities in this place.
                    </p>
                </Col>
            </Row> 
            <Row className={"justify-content-md-left"}>
                <Col lg={4}>
                    <h2>Regional MBTI Distribution</h2>
                    <svg className={styles.svgStyle} id={"barchart"} width={barchart_width} height={barchart_height}>
                        <BarChart offsetX={barchart_margin.left} offsetY={barchart_margin.top} 
                            height={barchart_inner_height} width={barchart_inner_width} data={distribution}
                            clickedCountry={clickedCountry}
                        />
                    </svg>
                </Col>
                <Col lg={8}>
                    <h2>Global MBTI Distribution</h2>
                    <div>
                        <label>Select Personality: </label>
                        <select onChange={(e) => setSelectedPersonality(e.target.value)}>
                            <option value="">All</option>
                            <option value="INTJ">INTJ</option>
                            <option value="INTP">INTP</option>
                            <option value="ENTJ">ENTJ</option>
                            <option value="ENTP">ENTP</option>
                            <option value="INFJ">INFJ</option>
                            <option value="INFP">INFP</option>
                            <option value="ENFJ">ENFJ</option>
                            <option value="ENFP">ENFP</option>
                            <option value="ISTJ">ISTJ</option>
                            <option value="ISFJ">ISFJ</option>
                            <option value="ESTJ">ESTJ</option>
                            <option value="ESFJ">ESFJ</option>
                            <option value="ISTP">ISTP</option>
                            <option value="ISFP">ISFP</option>
                            <option value="ESTP">ESTP</option>
                            <option value="ESFP">ESFP</option>
                        </select>
                    </div>
                    <svg className={styles.svgStyle} id={"map"} width={map_width} height={map_height}>
                        <AirportMap width={map_width} height={map_height} 
                            countries={map} distribution={distribution}
                            onCountryClick={handleCountryClick} 
                            selectedPersonality={selectedPersonality}
                        />
                    </svg>
                </Col>
                </Row>
            <Row>
                <Col lg={10} >
                    <p className={styles.paragraphStyle}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In the heatmap and barchart below, you can explore what is the average income for
                        different MBTI peronsalities, and also the correlation between MBTI and Zodiac signs. 
                        Zodiac signs are associated with specific dates of the year and
                        these signs are often linked to particular personality traits and characteristics, based on astrological interpretations.
                    </p>
                </Col>
            </Row>
            <Row>
                <Col lg={4}>
                    <h2>MBTI & Zodiac</h2>
                    <svg className={styles.svgStyle} id={"heatmap"} width={425} height={400}>
                        <Heatmap width={500} height={400} 
                                data = {zodiac} 
                                setHighlightedMBTI={setHighlightedMBTI}
                                highlightedMBTI={highlightedMBTI}
                        />
                    </svg>
                </Col>
                <Col lg={8}>
                    <h2>MBTI & Income</h2>
                    <svg className={styles.svgStyle} id={"barchart"} width={500} height={300}>
                        <PersonalityIncomeChart
                            offsetX={0}
                            offsetY={0}
                            height={300}
                            width={550}
                            data={{
                                labels: ["ENTJ", "ESTJ", "ENTP", "ESTP", "ISTJ", "ESFJ", "ENFJ", "INTJ", "ESFP", "ENFP", "ISFJ", "ISTP", "INFJ", "INTP", "ISFP", "INFP"],
                                datasets: [{
                    label: 'Average Income by Personality Type',
                    backgroundColor: ['#CAB8E0', '#9FD3DF', '#CAB8E0', '#F5E09D', '#9FD3DF', '#9FD3DF', '#B2CF99', '#CAB8E0', '#F5E09D', '#B2CF99', '#9FD3DF', '#F5E09D', '#B2CF99', '#CAB8E0', '#F5E09D', '#B2CF99'],
                    borderColor: '#eee',
                    borderWidth: 1,
                    data: [59993, 57831, 54103, 53275, 49994, 47902, 47292, 46986, 45067, 42228, 41835, 41229, 39992, 38411, 34595, 33736],
                                }]
                            }}
                            highlightedMBTI={highlightedMBTI}
                            setHighlightedMBTI={setHighlightedMBTI}
                        />
                    </svg>
                </Col>
            </Row>
            </Container>)
}


export default MBTI