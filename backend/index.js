const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Policy = require('./models/policy');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://tarun:170104@cluster0.od9tt3b.mongodb.net/policies')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(cors());

app.post('/api/policies', async (req, res) => {
  try {
    const policy = new Policy(req.body);
    await policy.save();
    res.status(201).send(policy);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/policies', async (req, res) => {
  try {
    const policies = await Policy.find();
    res.status(200).send(policies);
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).send(error);
  }
});

app.get('/api/policies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findById(id);
    if (!policy) {
      return res.status(404).send({ error: 'Policy not found' });
    }
    res.status(200).send(policy);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/api/policies/:policyNumber', async (req, res) => {
  try {
    const { policyNumber } = req.params;
    const updatedPolicy = await Policy.findOneAndUpdate(
      { policyNumber },
      { $set: req.body },
      { new: true }
    );

    if (!updatedPolicy) {
      return res.status(404).send({ error: 'Policy not found' });
    }

    res.status(200).send(updatedPolicy);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/api/policies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, policyNumber } = req.body;

    const updatedPolicy = await Policy.findByIdAndUpdate(
      id,
      { status, policyNumber },
      { new: true }
    );

    if (!updatedPolicy) {
      return res.status(404).send({ error: 'Policy not found' });
    }

    res.status(200).send(updatedPolicy);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/api/policies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findByIdAndDelete(id);
    if (!policy) {
      return res.status(404).send({ error: 'Policy not found' });
    }
    res.status(200).send(policy);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/policies/:policyId/comments', async (req, res) => {
  const { policyId } = req.params;
  const { comments } = req.body;


  if (!mongoose.Types.ObjectId.isValid(policyId)) {
    return res.status(400).json({ error: 'Invalid policy ID' });
  }

  try {
    const policy = await Policy.findById(policyId);

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    policy.comments = comments;
    await policy.save();

    return res.status(200).json(policy);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
