$(document).ready(function () {

  var personalNumber = "4003";
  var url = "http://157.230.17.132:" + personalNumber + "/sales";

  $.ajax({
    url: url,
    method: "GET",
    success: function (data) {
      var json = [];
      for (var i = 0; i < data.length; i++) {
        json.push(data[i]);
      }
      // console.log(json);

    // ---------------creazione passaggio intermedio ed in seguito gli array finali---------------
      var storageIntermedio = {};

      for (var i = 0; i < json.length; i++) {
        var elementoArray = json[i];
        var nome = elementoArray.salesman;
        if (storageIntermedio[nome] === undefined) {
          storageIntermedio[nome] = 0;
        }
        storageIntermedio[nome] += elementoArray.amount;
      }
      // console.log(storageIntermedio);

      var labels = [];
      var dataGrafico = [];

      for (var key in storageIntermedio) {
        labels.push(key);
        dataGrafico.push(storageIntermedio[key]);
      }

      // ---------------------Calcolo in percentuale della parte di ogni venditore---------------------
      var totaleFatturato = 0;
      for (var i = 0; i < dataGrafico.length; i++) {
        totaleFatturato += parseInt(dataGrafico[i]);
      }

      var dataGraficoPercentuale = [];
      for (var i = 0; i < dataGrafico.length; i++) {
        var valorePercentuale = ((parseInt(dataGrafico[i]) / totaleFatturato) * 100).toFixed(2);
        dataGraficoPercentuale.push(valorePercentuale);
      }
      // ---------------------Calcolo in percentuale della parte di ogni venditore---------------------

      // console.log(labels);
      // console.log(dataGrafico);
    // ---------------fine creazione passaggio intermedio ed in seguito gli array finali---------------

    var colors = ["#48dbfb", "#ff9f43", "#1dd1a1", "#ff9ff3"]

    // --------------------------------PARTE GRAFICO--------------------------------
      var ctx = document.getElementById('myChart').getContext('2d');
      var myPieChart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: labels,
              datasets: [{
                  label: 'My First dataset',
                  backgroundColor: colors,
                  data: dataGraficoPercentuale
              }]
          },
          options: {
            title: {
                display: true,
                text: 'Vendite per venditore',
                fontSize: 20
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                }
              }
            }
        }
      });
    // --------------------------------PARTE GRAFICO--------------------------------
    },
    error: function (err) {
      alert("Qualcosa è andato storto!");
    }
  });






















});
