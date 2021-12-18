import { useState } from "react"
import { dateToUnix, isSameDay } from './utils'
import bitcoinService from './bitcoinService'
import { StatisticContainer, DateInput, FormLabel, SubmitButton } from "./styledComponents"

/**
 * This component displays form for getting user input of start date and end date and sends
 * request to CoinGecko API when form is submitted. 
 *  
 * @param {function} callbackToParent Callback function to return form data and API response to 
 * the parent component.
 */
const DateForm = ({callbackToParent}) => {

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = async event => {
    event.preventDefault();

    if (datesAreValid(startDate, endDate)) {
      const start = dateToUnix(startDate);
      //1 hour (3600s) is added to the end date to get full data from that day
      const end = dateToUnix(endDate) + 3600;
  
      try {
        const response = await bitcoinService.getHistoryByRange(start, end);
        const data = {
          startUnix: start,
          endUnix: end, 
          response: response 
        }
        callbackToParent(data);
      } catch (error) {
        console.log(error);
      }
    } 
  }

  /** Check that dates are valid for the api request */
  const datesAreValid = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > currentDate || end > currentDate) {
      console.log("Ooops! Both dates should be in the past.")
      return false;
    }
    if (end < start) {
      console.log("Ooops! Starting date should be before ending date.");
      return false;
    }
    if (isSameDay(start, end)) {
      console.log("Oooops! Dates should be different.")
      return false;
    }
    return true;

  }

  return (
    <StatisticContainer>
      <form onSubmit={handleSubmit}>
        <FormLabel>Start date</FormLabel><br/>
        <DateInput 
          type="date" 
          id="inputDate" 
          name="startInput"
          required
          onChange={({ target }) => setStartDate(target.value)}>
        </DateInput><br/>
        <FormLabel>End date</FormLabel><br/>
        <DateInput
          type="date" 
          id="inputDate" 
          name="endInput"
          required
          onChange={({ target }) => setEndDate(target.value)}>
        </DateInput><br/>
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </StatisticContainer>
  )
}

export default DateForm;