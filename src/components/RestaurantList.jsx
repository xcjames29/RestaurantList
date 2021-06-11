import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
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
    justify-content: center;
    width: 100%;
`;

const Thead = styled.thead`
`;

const Tbody = styled.tbody``;

const Trow = styled.tr`
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
    color: blue;
    &:hover{
        color: red;
    }
`;


const FilterContainer = styled.div`

`;

export default function RestaurantList() {
    let [restaurants, setRestaurants] = useState([]);
    let [pagination, setPagination] = useState(1);
    let [maxPage, setMaxPage] = useState(0);
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
            setRestaurants(data.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1
                : a.name.toLowerCase() !== b.name.toLowerCase() ? 1 : 0
            ));
        }
        getData();
    }, [])
    return (
        <Container>

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
                        {restaurants.map((e, index) => {
                            if ((index + 1) <= (pagination * 10) && (index + 1) > ((pagination * 10) - 10)){
                                return( 
                                <Trow key={e.id}>
                                    <Tdata>
                                        {e.name}
                                    </Tdata>
                                    <Tdata>
                                        {e.city}
                                    </Tdata>
                                    <Tdata>
                                        {e.state}
                                    </Tdata>
                                    <Tdata>
                                        {e.telephone}
                                    </Tdata>
                                    <Tdata>
                                        {e.genre}
                                    </Tdata>
                                </Trow>)
                            }
                            else return <> </>
                        })}
                    </Tbody>
                </Table>
                <PaginationWrapper>
                    {pagination !== 1 &&
                        <PaginationBtns onClick={()=>{if(pagination>1) setPagination(pagination-1)}}>Previous</PaginationBtns>
                    }
                    {pagination !== maxPage &&
                        <PaginationBtns onClick={()=>{if(pagination<maxPage) setPagination(pagination+1)}}>Next</PaginationBtns>
                    }
                </PaginationWrapper>
            </TableContainer>
        </Container>
    )
}