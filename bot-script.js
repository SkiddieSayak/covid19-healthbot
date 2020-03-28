var botui = new BotUI('mediflic-covid19-bot');

var score = 0;
var condi;
  
// Data which will write in a file. 
var outputdata = `----- Data Collection ------- \n \n`; 
var loc;
$.ajax({
  url: "https://geolocation-db.com/jsonp",
  jsonpCallback: "callback",
  dataType: "jsonp",
  success: function(location) {
	loc =JSON.stringify(location);
	outputdata = outputdata.concat(` USERS IP Info DUMP : `,loc,`\n\n\n`);
	outputdata = outputdata.concat(` USERS CITY IS : `,location.city,`\n`);
  }
});


botui.message.add({
  delay: 500,
  loading: true,
  content: 'Greetings! Our Covid-19 self-evaluation examine has been created based on the guidelines from the WHO and MHFW, Government of India. This assessment result ought not to be taken as expert clinical guidance. Any data you share with us will be kept confidential.'
});

botui.message.add({
    delay: 500,
    loading: true,
    content: 'Do you want to go through the screening?'
  }).then(function () {
    return botui.action.button({
      action: [
        {
          text: 'Yes',
          value: 'Y'
        },
        {
          text: 'No',
          value: 'N'
        }
      ]
    });
}).then(function (res) {
  var message;

  if (res.value === "N") {
    return botui.message.add({
      type: 'html',
      delay: 1000,
      loading: true,
      content: 'Thanks!'
    });
  }
  else if (res.value === "Y") {
    return botui.message.add({
    type: 'html',
    delay: 1000,
    loading: true,
    content: 'Share your full name'
    }).then(function (res) {
      return botui.action.text({
        action: {
			cssClass: 'name' ,
          placeholder: 'Enter your Name here'
        }
      }).then(function (res) { // will be called when it is submitted.
      console.log(res.value); // will print whatever was typed in the field.
      outputdata = outputdata.concat(` Name : `, res.value,`\n`);
        return botui.message.add({
        type: 'html',
        delay: 1000,
        loading: true,
        content: 'Share Your Phone Number'
        });
      }).then(function (res) { 
        return botui.action.text({
        action: {
		  sub_type: 'tel',
		  cssClass: ['phone'],
          placeholder: 'Enter your Phone Number here'
        }
        });
      });
    }).then(function (res) {
      outputdata = outputdata.concat(` Phone Number : `, res.value,`\n`);
      return botui.message.add({
        delay: 1000,
        loading: true,
        content: 'How old are you?'
      });
    }).then(function (index) {
      return botui.action.text({
        action: {
          sub_type: 'number',
          placeholder: 'Enter your Age'
        }
      });
    }).then(function (res) {
      outputdata = outputdata.concat(` AGE : `, res.value,`\n`);
      return botui.message.add({
        delay: 1000,
        loading: true,
        content: 'Share your gender.'
      });
    }).then(function (index) {
      return botui.action.select({
        action: {
            placeholder : "Select Gender", 
            value: 'M', // Selected value or selected object. Example: {value: "TR", text : "Türkçe" }
            searchselect : true, // Default: true, false for standart dropdown
            label : 'text', // dropdown label variable
            options : [
                            {value: "M", text : "Male" },
                            {value: "F", text : "Female" },
                            {value: "TR", text : "Other" },
                      ],
            button: {
              icon: 'check',
              label: 'OK'
            }
          }
      });
      }).then(function (res) { 
        outputdata = outputdata.concat(` GENDER : `, res.value,`\n`);
        return botui.message.add({
        delay: 1000,
        loading: true,
        content: 'What is your present body temperature?'
      });
    }).then(function (index) {
      return botui.action.select({
        action: {
            placeholder : "Select Temperature",
            searchselect : true, // Default: true, false for standart dropdown
            label : 'text', // dropdown label variable
            options : [
                            {value: "a", text : "96 ° F to 98.6 ° F" },
                            {value: "b", text : "98.6 ° F to 102 ° F" },
                            {value: "c", text : "More than 102 ° F" },
                            {value: "d", text : "Not sure" },
                      ],
            button: {
              icon: 'check',
              label: 'OK'
            }
          }
      });
    }).then(function (res) {
      if( res.value == 'b' || res.value == 'c')
        score =score + 1;
      outputdata = outputdata.concat(` BODY TEMP : `, res.value,`\n`);
      return botui.message.add({
      delay: 500,
      loading: true,
      content: 'Did you travel to any of the following places in the last 3 months?'
      });
    }).then(function (res) {
        return botui.action.select({
        action: {
            placeholder : "Select Country", 
            searchselect : true, // Default: true, false for standart dropdown
            label : 'text', // dropdown label variable
            options : [
                            {value: "CN", text : "China" },
                            {value: "IRA", text : "Iran" },
                            {value: "SK", text : "South Korea" },
                            {value: "EU", text : "Europe" },
                            {value: "UK", text : "The United Kingdom" },
                            {value: "IRE", text : "Ireland" },
                            {value: "None", text : "None" },
                      ],
            button: {
              icon: 'check',
              label: 'OK'
            }
          }
        });
    }).then(function (res) {
      outputdata = outputdata.concat(` VISITED COUNTRY : `, res.value,`\n`);
      if(res.value != 'None')
        score =score +1;
      return botui.message.add({
      delay: 500,
      loading: true,
      content: 'Can you relate to any of the symptoms below? (Mark all those applicable)'
      });
    }).then(function (res) {
        return botui.action.select({
        action: {
            placeholder : "Select all possible options", 
            multipleselect : true,
            options : [
                            {value: "DryCough", text : "Dry Cough" },
                            {value: "Sneezing", text : "Sneezing" },
                            {value: "SoreThroat", text : "Sore Throat" },
                            {value: "Weakness", text : "Weakness" },
                            {value: "RunnyNose", text : "Runny Nose" },
                            {value: "ShortnessOfBreath", text : "Shortness of breath" },
                            {value: "None", text : "None of these" },
                      ],
            button: {
              icon: 'check',
              label: 'OK'
            }
          }
        });
    }).then(function (res) {
      outputdata = outputdata.concat(` SYMPTOMS : `, res.value,`\n`);
      res_arr = res.value.split(',');
      res_num = res_arr.length;
      score = score + res_num;
      return botui.message.add({
      delay: 500,
      loading: true,
      content: 'Are you experiencing any other symptoms? (Mark all applicable)'
      });
    }).then(function (res) {
        return botui.action.select({
        action: {
            placeholder : "Select all possible options", 
            multipleselect : true,
            options : [
                            {value: "Drowsiness", text : "Drowsiness" },
                            {value: "Painchest", text : "Pain and pressure in the chest" },
                            {value: "Bluish f/l", text : "Bluish face/ lip" },
                            {value: "SoreThroat", text : "Sore throat" },
                            {value: "SuddenChills", text : "Sudden chills" },
                            {value: "Vomiting", text : "Vomiting" },
                            {value: "LossAppetite", text : "Loss of appetite" },
                            {value: "None", text : "None of these" },
                      ],
            button: {
              icon: 'check',
              label: 'OK'
            }
          }
        });
    }).then(function (res) {
      outputdata = outputdata.concat(` OTHER SYMPTOMS : `, res.value,`\n`);
      res_arr = res.value.split(',');
      res_num = res_arr.length;
      score = score + res_num;
      return botui.message.add({
      delay: 500,
      loading: true,
      content: 'Mark all the applicable exposure details.'
      });
    }).then(function (res) {
        return botui.action.select({
        action: {
            placeholder : "Select all possible options", 
            multipleselect : true,
            options : [
                            {value: "ContactWithFlu", text : "Contact with anyone with cold/ flu or other symptoms" },
                            {value: "ContactWithCorona", text : "Contact with confirmed Corona infected in the last 12-14 days" },
                            {value: "None", text : "None" },
                      ],
            button: {
              icon: 'check',
              label: 'OK'
            }
          }
        });
    }).then(function (res) {
      outputdata = outputdata.concat(` EXPOSURE : `, res.value,`\n`);
		  res_arr = res.value.split(',');
		  res_num = res_arr.length;
		if(res_num == 1){
			if (res_arr[0] == 'ContactWithCorona')
				score = score + 5;
			else
				score = score + 2;
		}else
			score = score + 7;
      return botui.message.add({
      delay: 500,
      loading: true,
      content: 'Do you have any of the following conditions? (Mark all applicable)'
      });
    }).then(function (res) {
        return botui.action.select({
        action: {
            placeholder : "Select all possible options", 
            value: 'China', // Selected value or selected object. Example: {value: "TR", text : "Türkçe" }
            multipleselect : true,
            options : [
                            {value: "HighBP", text : "High blood pressure" },
                            {value: "Diabetes", text : "Diabetes" },
                            {value: "HeartDisease", text : "Heart disease" },
                            {value: "KidneyDisorder", text : "Kidney disorder" },
                            {value: "LowImmune", text : "Low immunity" },
                            {value: "LungDisease", text : "Lung disease" },
                            {value: "Stroke", text : "Stroke" },
                            {value: "None", text : "None" },
                      ],
            button: {
              icon: 'check',
              label: 'OK'
            }
          }
        });
    }).then(function (res) {
      outputdata = outputdata.concat(` HEALTH CONDITIONS : `, res.value,`\n`);
      res_arr = res.value.split(',');
      res_num = res_arr.length;
      score = score + res_num;
      return botui.message.add({
      delay: 500,
      loading: true,
      content: 'Have you noticed any change in your symptoms over the last 48 hours?'
      });
    }).then(function (res) {
        return botui.action.select({
        action: {
            placeholder : "Select Condition", 
            searchselect : true, // Default: true, false for standart dropdown
            label : 'text', // dropdown label variable
            options : [
                            {value: "W", text : "Worsened" },
                            {value: "WR", text : "Worsened rapidly" },
                            {value: "I", text : "Improved" },
                            {value: "None", text : "None" },
                      ],
            button: {
              icon: 'check',
              label: 'OK'
            }
          }
    }).then(function (res) {
      outputdata = outputdata.concat(` CHANGE IN SYMPTOMS : `, res.value,`\n`);
        if(res.value == "WR")
          score =score + 10;
        else if(res.value == 'W')
          score =score + 5;
        else if(res.value == 'I'){
			if(score > 3)
          		score =score - 2;
		}

        var risky = (score / 39 )*100;
        if (risky >= 0 && risky <= 20)
          condi = ` <h3 class="result_h3" style="" >Chance of infection- Low </h3>\n`+ '![product image](https://healthbot.mediflic.com/COVID-19_BOT/images/mediflic-risk-assesment-low.png) \n\n'+`We recommend:<br>
                    &nbsp;&nbsp;•Stay home.<br>
                    &nbsp;&nbsp;•Maintain social distancing as much as possible.<br>
                    &nbsp;&nbsp;•Take preventive measures.<br>
                    &nbsp;&nbsp;•If any symptom arises, get in touch with a doctor as soon as possible.<br><br>
                    For any more queries, feel free to reach us at care@mediflic.com`;
      else if (risky >20 && risky <=50)
        condi =` <h3 class="result_h3" style="">Chance of infection- Medium </h3>\n `+ '![product image](https://healthbot.mediflic.com/COVID-19_BOT/images/mediflic-risk-assesment-medium.png) \n\n'+`We recommend:<br>
                &nbsp;&nbsp;•Consult with the doctor.<br>
                &nbsp;&nbsp;•Start home isolation on an immediate basis.<br>
                &nbsp;&nbsp;•As per your doctor’s advice, go for laboratory tests and COVID 19 testing.<br>
                &nbsp;&nbsp;•Keep a check on your symptoms and keep updating your doctor. If the situation worsens immediately seek medical attention.<br><br>
                For any more queries, feel free to reach us at care@mediflic.com`;
      else if (risky >50 )
      condi =` <h3 class="result_h3" style="">Chance of infection- High </h3>\n `+ '![product image](https://healthbot.mediflic.com/COVID-19_BOT/images/mediflic-risk-assesment-high.png) \n\n'+`We recommend:<br> 					&nbsp;&nbsp;•Immediately seek medical attention.<br>
                &nbsp;&nbsp;•Get yourself tested.<br>
                &nbsp;&nbsp;•Contact your regular or nearest available doctor.<br>
                &nbsp;&nbsp;•Monitor your symptoms and isolate yourself.<br><br>
                For any more queries, feel free to reach us at care@mediflic.com`;

      return botui.message.add({
      delay: 500,
      loading: true,
	  cssClass: 'custom-class',
      content: 'Your Risk Score is : ' +risky+ condi
      });
    });
    }).then(function (res) {
      outputdata = outputdata.concat(` RESULT : `, condi,`\n`);
      var data = new FormData();
      data.append("data" , outputdata);
      var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
      xhr.open( 'post', 'save.php', true );
      xhr.send(data);

    });
  }
});
