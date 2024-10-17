import React, { useState } from 'react'
import axios from 'axios'
import { ModelStatus } from '../Types/Types'

const ModelStatusView = () => {
    const [status, setStatus] = useState<ModelStatus | null>(null)

    const fetchStatus = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/status`)
            console.log(response.data)
            setStatus(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <button onClick={fetchStatus}>Fetch Model Status</button>
            {status && (
                <div>
                    <p>Trained: {status.is_trained ? 'Yes' : 'No'}</p>
                    {status.is_trained && (
                        <>
                            <p>Algorithm: {status.model_algorithm}</p>
                            <p>Best Params: {JSON.stringify(status.best_params)}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ModelStatusView