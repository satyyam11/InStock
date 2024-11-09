const express = require('express');
const router = express.Router();
const predictionService = require('../services/predictionService');

// Route to train the model
router.post('/train', async (req, res) => {
    try {
        // Sample training data if none provided
        const trainingData = req.body.trainingData || {
            inputs: [
                [100, 10, 1.0, 7],
                [80, 8, 0.8, 5],
                [120, 12, 1.2, 6],
                [90, 9, 1.0, 4],
                [110, 11, 0.9, 5]
            ],
            outputs: [
                [90],
                [70],
                [100],
                [85],
                [95]
            ]
        };

        await predictionService.createAndTrainModel(trainingData);
        res.json({ message: 'Model trained successfully!' });
    } catch (error) {
        console.error('Training endpoint error:', error.message || JSON.stringify(error));
        res.status(500).json({ error: error.message || 'An error occurred during model training' });
    }
});

// Route to make predictions
router.post('/predict', async (req, res) => {
    try {
        const { currentStock, salesSpeed, seasonFactor, restockDays } = req.body;

        // Validate input data
        if (!currentStock || !salesSpeed || !seasonFactor || !restockDays) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const inputData = [currentStock, salesSpeed, seasonFactor, restockDays];
        const prediction = await predictionService.predict(inputData);

        res.json({
            recommendedStock: Math.round(prediction),
            inputData: {
                currentStock,
                salesSpeed,
                seasonFactor,
                restockDays
            }
        });
    } catch (error) {
        console.error('Prediction endpoint error:', error.message || JSON.stringify(error));
        res.status(500).json({ error: error.message || 'An error occurred during prediction' });
    }
});

module.exports = router;
