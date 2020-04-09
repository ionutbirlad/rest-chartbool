$(document).ready(function () {

// -----------------------------------------------------URL------------------------------------------------------
var personalNumber = "4003";
var url = "http://157.230.17.132:" + personalNumber + "/sales";
// -----------------------------------------------------URL------------------------------------------------------

// --------------------------------------------------HANDLEBARS--------------------------------------------------
  // DA RIPETERE SOLO UNA VOLTA PER TEMPLATE
   var source = $("#entry-template").html();
   var template = Handlebars.compile(source);
  // DA RIPETERE SOLO UNA VOLTA PER TEMPLATE

  popolaNomiSelect(url);
// --------------------------------------------------HANDLEBARS--------------------------------------------------


// ------------------------------------------------PRIMO GRAFICO-------------------------------------------------
  chartAjaxCall(url, mockupDatiTorta, creazioneGraficoTorta, "torta");
// ----------------------------------------------FINE PRIMO GRAFICO----------------------------------------------



// ---------------------------------------------SECONDO GRAFICO--------------------------------------------------
  chartAjaxCall(url, mockupDatiLinea, creazioneGraficoLinea, "linea");
// ---------------------------------------------FINE SECONDO GRAFICO---------------------------------------------



// ------------------------AGGIUNTA NUOVE INFORMAZIONI AI GRAFICI + AGGIORNAMENTO GRAFICI------------------------
  $(".btn-post").click(function () {
    updateSales(url);
    chartAjaxCall(url, mockupDatiTorta, creazioneGraficoTorta, "torta");
    chartAjaxCall(url, mockupDatiLinea, creazioneGraficoLinea, "linea");
  });
// ------------------------AGGIUNTA NUOVE INFORMAZIONI AI GRAFICI + AGGIORNAMENTO GRAFICI------------------------






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
      storageIntermedio[nome] += parseInt(elementoArray.amount);
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
    // console.log(dataGraficoPercentuale);
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
        var dataOperazione = moment(json[j].date, "DD/MM/YYYY");
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


  // CHIAMATA AJAX
  function chartAjaxCall(url, mockup, createChart, type) {
    $.ajax({
      url: url,
      method: "GET",
      success: function (data) {
        var tipologia = type;
        var infoGrafico = mockup(data);
        if (tipologia == "torta") {
          createChart(infoGrafico.nomi, infoGrafico.datiInPercentuale, infoGrafico.colori);
        } else if (tipologia == "linea") {
          createChart(infoGrafico.mesi, infoGrafico.fatturati);
        }
      },
      error: function (err) {
        alert("Qualcosa è andato storto!");
      }
    });
  }
  // CHIAMATA AJAX


  // POPOLAMENTO NOMI IN SELECT
  function popolaNomiSelect(url) {
    $.ajax({
      url: url,
      method: "GET",
      success: function (data) {
        var names = [];
        for (var i = 0; i < data.length; i++) {
          if (!(names.includes(data[i].salesman))) {
            names.push(data[i].salesman);
          }
        }
        for (var i = 0; i < names.length; i++) {
          var namesInObject = {
            persona: names[i]
          };
          var templateCompiled = template(namesInObject);
          $(".who-post-to").append(templateCompiled);
        }
      },
      error: function (err) {
        alert("Qualcosa è andato storto!");
      }
    });
  }
  // POPOLAMENTO NOMI IN SELECT


  // FUNZIONE AGGIORNAMENTO VENDITE
  function updateSales(url) {
    $("#myChart").remove();
    $("#myChart-two").remove();
    $(".wrapper-one").append("<canvas id='myChart'></canvas>");
    $(".wrapper-two").append("<canvas id='myChart-two'></canvas>");

    var persona = $(".who-post-to").val();
    $(".who-post-to").val("");
    var meseSelezionato = $(".month-to-post").val();
    var dataInCuiInserire = moment("01/" + meseSelezionato + "/2017", "DD/MM/YYYY");
    var importo = $(".text-post").val();
    $(".text-post").val("");
    var importoDaInserire = parseInt(importo);
    // console.log(persona);
    // console.log(meseSelezionato);
    // console.log(dataInCuiInserire.format("DD-MM-YYYY"));
    // console.log(importoDaInserire);
    if (importo.trim().length > 0) {
      $.ajax({
        url: url,
        method: "POST",
        data: {
          salesman: persona,
          date: dataInCuiInserire.format("DD/MM/YYYY"),
          amount: parseInt(importoDaInserire)
        },
        success: function (data, stato) {
          console.log(data);
          console.log(stato);
        },
        error: function (richiesta, stato, errori) {
          alert("Qualcosa è andato storto!");
        }
      });
    }
  }
  // FUNZIONE AGGIORNAMENTO VENDITE
// -----------------------------------------------------FUNZIONI-----------------------------------------------------





















});
