import Joi from 'joi';

const tripSchema = Joi.object({
  selectedDest: Joi.string().required().messages({
    'string.empty': 'Please select a destination',
    'any.required': 'Destination is required',
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date is required',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().required().greater(Joi.ref('startDate')).custom((value, helpers) => {
    const { startDate } = helpers.state.ancestors[0];
    const diffTime = Math.abs(new Date(value) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    if (diffDays > 5) {
      return helpers.message('The trip cannot be longer than 5 days');
    }
    return value;
  }).messages({
    'date.base': 'End date is required',
    'date.greater': 'End date must be after start date',
    'any.required': 'End date is required',
  })
});

export default tripSchema