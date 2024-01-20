import React, { useState, useEffect } from 'react';
import axios from 'axios';


import {
  Container,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { useFormik } from 'formik';
import { values } from 'lodash';

const App = () => {
  const [options, setOptions] = useState([]);
  const [data, setData] = useState({});
  const [from, setFrom] = useState("usd");
  const [ans, setAns] = useState(0);

  useEffect(() => {
    setOptions(Object.keys(data.rates || {}));
  }, [data]);






  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      input: '',
    },
    onSubmit: values => {

      if(values.input === ''){
        alert("Please Enter Number")
        return;
      }
      else if(values.input < 0)
      {
        alert("Please Enter Positive Number")
        return;
      }
      else if(values.from === values.to)
      {
        alert("Please Select Different Currency")
        return;
      }
      var rate = data.rates[values.to]
      setAns(values.input * rate);
      formik.resetForm();
    
    }

  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/usd');

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [formik.values.from, formik.values.to]); 


  return (
    <Container>
      <form onSubmit={formik.handleSubmit}>
        <Stack alignItems={'center'} justifyContent={'center'} height={'100vh'} width={"100%"} spacing={4}>
          <TextField id="outlined-basic" label="Enter Number" variant="outlined" name='input' value={formik.values.input} onChange={formik.handleChange}
            type="number"

            InputLabelProps={{
              shrink: true,
            }}
          />


          <Select
            onChange={formik.handleChange}
            displayEmpty
            name='from'
            value={formik.values.from}
            inputProps={{ 'aria-label': 'Select a value' }}
          >
            <MenuItem value="" disabled >
              Select an Currency
            </MenuItem>
            {options.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Select
            onChange={formik.handleChange}
            name='to'
            value={formik.values.to}
            displayEmpty
            inputProps={{ 'aria-label': 'Select a value' }}
          >
            <MenuItem value="" disabled>
              Select an Currency
            </MenuItem>
            {options.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Button type='submit'>
            Ans
          </Button>
          <h2>{ans} {formik.values.to}</h2>
        </Stack>
      </form>
    </Container>
  );
};

export default App;
