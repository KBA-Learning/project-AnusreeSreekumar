import React from 'react'

const ScoreCard = ({ totalScore, latestScore }) => {
    return (
        <div className='flex justify-end max-h-screen'>
            <div className="rounded-md shadow-lg flex flex-col items-center justify-center w-72 h-40 mt-12 mr-12 px-6 py-4 bg-blue-100">
                <h2 className="text-center font-bold mb-8 text-lg text-gray-800">Player Scorecard</h2>
                <div className="score-details text-md font-medium text-gray-600">
                    <p>
                        <strong>Total Scores: </strong>
                        <span className="text-blue-800">{totalScore}</span>
                    </p>
                    <p>
                        <strong>Latest Quiz Score: </strong>
                        <span className="text-blue-800">{latestScore}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ScoreCard
