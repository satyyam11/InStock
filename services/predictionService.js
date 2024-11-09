const brain = require('brain.js');
const fs = require('fs').promises;
const path = require('path');

class PredictionService {
    constructor() {
        this.model = new brain.NeuralNetwork({
            hiddenLayers: [64, 32], 
            activation: 'sigmoid',  
        });
        this.modelPath = path.join(__dirname, '../models/inventory-model.json'); 
        this.isModelTrained = false; 
    }

    // Train the model with provided data
    async createAndTrainModel(trainingData) {
        try {
            const trainingFormattedData = trainingData.inputs.map((input, index) => {
                return { input: input, output: trainingData.outputs[index] };
            });

            // Train the model
            await this.model.trainAsync(trainingFormattedData, {
                iterations: 200,
                log: (error) => {
                    console.log(`Error: ${error}`);
                },
                errorThresh: 0.01, 
            });

            // Save the model after training
            await this.saveModel();
            this.isModelTrained = true;  
            console.log('Model trained and saved successfully!');
            return true;
        } catch (error) {
            console.error('Training error:', error.message || JSON.stringify(error));
            throw error;
        }
    }

    // Save model to a file
    async saveModel() {
        try {
            await fs.mkdir(path.dirname(this.modelPath), { recursive: true });
            await fs.writeFile(this.modelPath, JSON.stringify(this.model.toJSON()));
            console.log('Model saved!');
        } catch (error) {
            console.error('Error saving model:', error.message || JSON.stringify(error));
            throw error;
        }
    }

    // Load the model from the saved file
    async loadModel() {
        try {
            const modelData = await fs.readFile(this.modelPath, 'utf-8');
            this.model.fromJSON(JSON.parse(modelData));
            this.isModelTrained = true;  // Mark model as loaded
            console.log('Model loaded!');
        } catch (error) {
            console.error('Error loading model:', error.message || JSON.stringify(error));
            throw error;
        }
    }

    // Predict using the trained model
    async predict(inputData) {
        try {
            if (!this.isModelTrained) {
                await this.loadModel(); // Load model if it's not already trained/loaded
            }

            const result = this.model.run(inputData); // Run prediction on the input
            return result; // Return the prediction result
        } catch (error) {
            console.error('Prediction error:', error.message || JSON.stringify(error));
            throw error;
        }
    }
}

module.exports = new PredictionService();
