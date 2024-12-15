import React, { useState, useEffect } from 'react'

const LeaderBoard = () => {

    const [leaderBoardData, setLeaderBoardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        const fetchldrbrdData = async () => {

            try {

                const response = await fetch('http://localhost:4000/leaderboard', {
                    credentials: 'include'
                })
                const fetchedData = await response.json();
                console.log(fetchedData);

                setLeaderBoardData(fetchedData.boardData);

            } catch (error) {
                console.log('Error occurred while fetching players data');
            }
            finally {
                setIsLoading(false); // Set loading to false once the fetch is complete
            }
        }
        fetchldrbrdData()
    }, [])

    useEffect(() => {
        console.log('Updated leaderBoardData:', leaderBoardData);
    }, [leaderBoardData]);

    if (isLoading) {
        return <div>Loading...</div>; // Show loading text while fetching data
    }

    return (
       
       <div className="container mx-auto mt-12 px-4 py-6">
            <h1 className="text-3xl font-semibold text-blue-600 text-center mb-4">Leaderboard</h1>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-12"> {/* Set max width and center alignment */}
                <table className="table-auto w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-900">
                        <tr>
                            <th className="px-4 py-3 font-medium text-center">Username</th>
                            <th className="px-4 py-3 font-medium text-center">Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderBoardData.length > 0 ? (
                            leaderBoardData.map((player, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 text-center">{player.dbUsername}</td>
                                    <td className="px-4 py-2 text-center">{player.dbTotalScore}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="px-4 py-2 text-center text-gray-500">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderBoard
