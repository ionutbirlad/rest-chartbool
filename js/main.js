$(document).ready(function () {

  var personalNumber = "4003";
  var url = "http://157.230.17.132:" + personalNumber + "/sales";

// ------------------------------------------------PRIMO GRAFICO------------------------------------------------
  $.ajax({
    url: url,
    method: "GET",
    success: function (data) {
      var infoGrafico = mockupDatiTorta(data);
      creazioneGraficoTorta(infoGrafico.nomi, infoGrafico.datiInPercentuale, infoGrafico.colori);
    },
    error: function (err) {
      alert("Qualcosa è andato storto!");
    }
  });
// ------------------------------------------------FINE PRIMO GRAFICO------------------------------------------------



// ------------------------------------------------SECONDO GRAFICO-----------------------------------------------------
  $.ajax({
    url: url,
    method: "GET",
    success: function (data) {
      var infoGrafico = mockupDatiLinea(data);
      creazioneGraficoLinea(infoGrafico.mesi, infoGrafico.fatturati);
    },
    error: function (err) {
      alert("Qualcosa è andato storto!");
    }
  });

// ------------------------------------------------FINE SECONDO GRAFICO------------------------------------------------


// -----------------------------------------------------FUNZIONI-----------------------------------------------------
  // MOCKUP DATI GRAFICO TORTA
  function mockupDatiTorta(data) {
    var json = data;
    // console.log(json);

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
    var colors = ["#48dbfb", "#ff9f43", "#1dd1a1", "#ff9ff3"]

    return  {
      nomi: labels,
      datiInPercentuale: dataGraficoPercentuale,
      colori: colors
    };
  }
  // MOCKUP DATI GRAFICO TORTA



  // CREAZIONE GRAFICO TORTA
  function creazioneGraficoTorta(labels, info, colors) {
      var ctx = document.getElementById('myChart').getContext('2d');
      var myPieChart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: labels,
              datasets: [{
                  label: 'My First dataset',
                  backgroundColor: colors,
                  data: info
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
  }
  // CREAZIONE GRAFICO TORTA



  // MOCKUP DATI GRAFICO LINEA
  function mockupDatiLinea(data) {
    var json = data;
    // console.log(json);

    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var totali = [];

    for (var i = 0; i <= 11; i++) {
      var indiceMese = i;
      // console.log(indiceMese);
      var totaleMese = 0;
      for (var j = 0; j < json.length; j++) {
        var dataOperazione = moment(json[j].date, "DD-MM-YYYY");
        var meseOperazione = dataOperazione.month();
        // console.log(dataOperazione);
        // console.log(meseOperazione);
        if (meseOperazione == indiceMese) {
          totaleMese += parseInt(json[j].amount);
        }
      }
      totali.push(totaleMese);
    }
    // console.log(totali);

    return {
      mesi: months,
      fatturati: totali
    };
  }
  // MOCKUP DATI GRAFICO LINEA



  // CREAZIONE GRAFICO LINEA
  function creazioneGraficoLinea(months, totali) {
    var ctx = document.getElementById('myChart-two').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: months,
          datasets: [{
              label: 'Fatturato',
              backgroundColor: '#341f97',
              data: totali
          }]
      },

      // Configuration options go here
      options: {
        title: {
            display: true,
            text: 'Fatturato mensile',
            fontSize: 20
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '€';
            }
          }
        }
      }
    });
  }
  // CREAZIONE GRAFICO LINEA
// -----------------------------------------------------FUNZIONI-----------------------------------------------------





















});
