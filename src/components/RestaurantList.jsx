import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import imgBg from "./img/bg.jpg"
const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    justify-content: center;
    background-image: url(${imgBg});
    background-repeat: repeat;
`;

const TableContainer = styled.div`
    min-height: 500px;
    width: 70vw;
    display: flex;
    flex-direction: column;
    flex-wrap:wrap ;
`;

const Table = styled.table`
    height: 100%;
    width: 100%;
    border: 1px solid black;
    border-collapse: collapse;
`;

const PaginationWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 70vw;
`;

const Thead = styled.thead`
`;

const Tbody = styled.tbody``;

const Trow = styled.tr`
    background-color: white;
    &:nth-child(even){
        background-color: #c0c0c0;
    }
`;

const Theader = styled.th`
    background-color: black;
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    min-width: 200px;
`;

const Tdata = styled.td`
    font-size: 16px;
    font-weight: 400;
    padding: 10px 20px;
    text-align: center;
`;

const PaginationBtns = styled.button`
    background-color: transparent;
    border: none;
    padding:10px;
    font-size: 18px;
    font-weight: bold;
    background-color: white;
    color: blue;
    cursor: pointer;
    &:hover{
        color: red;
    }
`;


const FilterContainer = styled.div`
    width: 70vw;
    display: flex;
    gap: 20px;
    justify-content: flex-end;
    align-items: center;
`;

const InputFilter = styled.input`
    font-size: 18px;
`;

const FilterButton = styled.button`
    font-size: 18px;
    padding: 5px 10px;
`;

const SelectGenre = styled.select`
    font-size: 18px;
    padding: 5px 10px;
`;

const Options = styled.option``;

const LabelText = styled.label`
    font-size: 16px;
    font-weight: bold;
    background-color: white;
`;


export default function RestaurantList() {
    let [restaurants, setRestaurants] = useState([]);
    let [pagination, setPagination] = useState(1);
    let [maxPage, setMaxPage] = useState(0);
    let [genreOptions, setGenreOptions] = useState([]);
    useEffect(() => {
        let getData = async () => {
            const URL = "http://128.199.195.196:3001/";
            let response = await fetch((URL), {
                method: "GET",
                headers: {
                    'Authorization': "Bearer iqi509189dxznal;,ggi"
                }
            })
            let data = await response.json();
            let max = Math.floor((data.length / 10)) + 1;
            setMaxPage(max);
            let option = new Set();
            data.forEach(e => {
                let genreList = e.genre.split(",")
                genreList.forEach(genre => {
                    option.add(genre)
                })

            })
            setGenreOptions([...option]);
            setRestaurants(data.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1
                : a.name.toLowerCase() !== b.name.toLowerCase() ? 1 : 0
            ));
        }
        getData();
    }, [])

    let filterRef = useRef();
    let [filteredList, setFilteredList] = useState([]);
    let [filter, setFilter] = useState("");
    let [filteredPagination, setFilteredPagination] = useState(1);
    let [genreFilter, setGenreFilter] = useState("All");
    let [filteredMax, setFilteredMax] = useState(1);
    let [isFiltered, setIsFiltered] = useState(false)

    let filterList = (genreTofilter) => {
        console.log("filter", filter);
        let toFilterGenre = genreTofilter ? genreTofilter : genreFilter;
        console.log(toFilterGenre);
        if (filter === "" && toFilterGenre === "All") {
            setIsFiltered(false);
            return
        }
        let newList = [];
        setIsFiltered(true);
        if (filter === "") {
            restaurants.forEach((e) => {
                let genres = e.genre.split(",");
                if (genres.includes(toFilterGenre)) newList.push(e)
            })
        }
        else if (filter !== "" && toFilterGenre === "All") {
            restaurants.forEach((e) => {
                if (e.name === filter || e.city === filter || e.state === filter || e.telephone === filter) newList.push(e)
            })
        }
        else {
            restaurants.forEach((e) => {
                let genres = e.genre.split(",");
                if (genres.includes(genreFilter)) {
                    if (e.name === filter || e.city === filter || e.state === filter || e.telephone === filter) newList.push(e)
                }
            })
        }
        console.log(newList);
        let max = Math.floor((newList / 10)) === 0 ? 1 : Math.floor((newList / 10))
        setFilteredMax(max)
        setFilteredList(newList);
    }

    let clearFilter = () => {
        setFilteredPagination(1);
        
        setFilteredMax(1);
        if(genreFilter==="All") setIsFiltered(false);
        filterList(genreFilter);
    }

    return (
        <Container>
            <FilterContainer>
                <LabelText htmlFor="filter">Filter: </LabelText>
                <InputFilter name="filter" ref={filterRef}
                    onChange={() => { setFilter(filterRef.current.value); if(filterRef.current.value === ""){ console.log("clear");clearFilter()} }}
                    onKeyUp={(e) => { if (e.key === "Enter") filterList() }} />
                <FilterButton onClick={() => filterList()}>Search</FilterButton>
                <LabelText htmlFor="genre">Genre: </LabelText>
                <SelectGenre name="genre" onChange={(e) => {
                    setGenreFilter(e.target.value)
                    filterList(e.target.value);
                }} >
                    <Options value="All">All</Options>
                    {genreOptions.map(e => <Options value={e}>{e}</Options>)}
                </SelectGenre>
            </FilterContainer>

            <TableContainer>
                <Table>
                    <Thead>
                        <Trow>
                            <Theader>Name</Theader>
                            <Theader>City</Theader>
                            <Theader>State</Theader>
                            <Theader>Phone number</Theader>
                            <Theader>Genre</Theader>
                        </Trow>
                    </Thead>
                    <Tbody>
                        {genreFilter === "All" && !isFiltered ? restaurants.map((e, index) => {
                            if ((index + 1) <= (pagination * 10) && (index + 1) > ((pagination * 10) - 10)) {
                                return (
                                    <Trow key={e.id}>
                                        <Tdata>{e.name}</Tdata>
                                        <Tdata>  {e.city} </Tdata>
                                        <Tdata>  {e.state}</Tdata>
                                        <Tdata> {e.telephone}</Tdata>
                                        <Tdata>{e.genre} </Tdata>
                                    </Trow>)
                            }
                            else return <> </>
                        })
                            : filteredList.map((e, index) => {
                                if ((index + 1) <= (filteredPagination * 10) && (index + 1) > ((filteredPagination * 10) - 10)) {
                                    return (
                                        <Trow key={e.id + "filtered"}>
                                            <Tdata> {e.name} </Tdata>
                                            <Tdata>{e.city} </Tdata>
                                            <Tdata>{e.state}</Tdata>
                                            <Tdata> {e.telephone} </Tdata>
                                            <Tdata> {e.genre}</Tdata>
                                        </Trow>)
                                } else return <> </>
                            })
                        }
                        {isFiltered && filteredList.length === 0 ? <Trow> <Tdata/><Tdata/> <Tdata>  <h1>No Result Found</h1> </Tdata></Trow> : <></>}
                    </Tbody>
                </Table>
            </TableContainer>
            <PaginationWrapper>
                {!isFiltered ?
                    pagination !== 1 &&
                    <PaginationBtns onClick={() => { if (pagination > 1) setPagination(pagination - 1) }}>Previous</PaginationBtns>
                    : filteredPagination !== 1 &&
                    <PaginationBtns onClick={() => { if (filteredPagination > 1) setFilteredPagination(filteredPagination - 1) }}>Previous</PaginationBtns>
                }
                {!isFiltered ?
                    pagination !== maxPage &&
                    <PaginationBtns onClick={() => { if (pagination < maxPage) setPagination(pagination + 1) }}>Next</PaginationBtns>
                    : filteredPagination < filteredMax &&
                    <PaginationBtns onClick={() => { if (filteredPagination < filteredMax) setFilteredPagination(filteredPagination + 1) }}>Next</PaginationBtns>
                }
            </PaginationWrapper>
        </Container>
    )
}