list_sentences = [];
plotly_heatmap = {data:[], layout:{}};
input_sentences = "";
input_threshold = 0.5;
output_resultshtml = "";
analyzing_text = true;

input_sentences =
`Will it snow tomorrow?
Recently a lot of hurricanes have hit the US
Global warming is real

An apple a day, keeps the doctors away
Eating strawberries is healthy

what is your age?
How old are you?
How are you?

The dog bit Johnny
Johnny bit the dog

The cat ate the mouse
The mouse ate the cat
`;

$("#input_sentences").text(input_sentences);
$("#input_threshold").text(input_threshold);

async function onClickAnalyzeSentences(){

  var list_sentences = [];
  var input_sentences = $("#input_sentences").val().split("\n");
  for(var i in input_sentences){
    if(input_sentences[i].length){
      list_sentences.push(input_sentences[i]);
    }
  }

  console.log(list_sentences);
  this.get_similarity(list_sentences);
}

function get_embeddings(list_sentences, callback) {
    use.load().then(model => {
      model.embed(list_sentences).then(embeddings => {
        callback(embeddings);
      });
    });
}

function dot(a, b){
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var sum = 0;
  for (var key in a) {
    if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
      sum += a[key] * b[key]
    }
  }
  return sum
}

function similarity(a, b) {
  var magnitudeA = Math.sqrt(this.dot(a, a));
  var magnitudeB = Math.sqrt(this.dot(b, b));
  if (magnitudeA && magnitudeB)
    return this.dot(a, b) / (magnitudeA * magnitudeB);
  else return false
}

function cosine_similarity_matrix(matrix){
  let cosine_similarity_matrix = [];
  for(let i=0;i<matrix.length;i++){
    let row = [];
    for(let j=0;j<i;j++){
      row.push(cosine_similarity_matrix[j][i]);
    }
    row.push(1);
    for(let j=(i+1);j<matrix.length;j++){
      row.push(this.similarity(matrix[i],matrix[j]));
    }
    cosine_similarity_matrix.push(row);
  }
  return cosine_similarity_matrix;
}

function form_groups(cosine_similarity_matrix){
  let dict_keys_in_group = {};
  let groups = [];

  for(let i=0; i<cosine_similarity_matrix.length; i++){
    var this_row = cosine_similarity_matrix[i];
    for(let j=i; j<this_row.length; j++){
      if(i!=j){
        let sim_score = cosine_similarity_matrix[i][j];

        input_threshold = $("#input_threshold").val();

        if(sim_score > input_threshold){

          let group_num;

          if(!(i in dict_keys_in_group)){
            group_num = groups.length;
            dict_keys_in_group[i] = group_num;
          }else{
            group_num = dict_keys_in_group[i];
          }
          if(!(j in dict_keys_in_group)){
            dict_keys_in_group[j] = group_num;
          }

          if(groups.length <= group_num){
            groups.push([]);
          }
          groups[group_num].push(i);
          groups[group_num].push(j);
        }
      }
    }
  }

  let return_groups = [];
  for(var i in groups){
    return_groups.push(Array.from(new Set(groups[i])));
  }

  console.log(return_groups);
  return return_groups;
}

async function get_similarity(list_sentences){

  let callback = function(embeddings) {

    // console.log("embeddings", embeddings);

    let cosine_similarity_matrix = this.cosine_similarity_matrix(embeddings.arraySync());

    // let = cosine_similarity_matrix =  JSON.parse('[[1,0.27125208972380876,0.370398149221912,0.18878527821534144,0.227397631066791,0.10192000454850794,0.11953149882183302,0.2834902129405744,0.15722505716992824,0.17310249396821675,0.06253368296671508,0.07279099852951824],[0.27125208972380876,1,0.5122564640252515,0.20083603354349733,0.08630973112142122,0.033102845734457216,0.029698284345009665,0.07269523960671254,0.08891865469218782,0.12367103665842975,0.07605207088226057,0.06907508038309863],[0.370398149221912,0.5122564640252515,1,0.2908344178604461,0.3264310601042961,0.04915068848494248,0.08648333127233725,0.10518094418915742,0.08222913989540509,0.14378829931809226,0.09021504689028166,0.10023098677716687],[0.18878527821534144,0.20083603354349733,0.2908344178604461,1,0.5016587865848317,0.1603235336520356,0.17104657047679664,0.14001172140218957,0.2354884902535023,0.26437381869337956,0.301659977077651,0.3097900080320079],[0.227397631066791,0.08630973112142122,0.3264310601042961,0.5016587865848317,1,0.12008232489373537,0.12347227906880556,0.14615857794356438,0.1862443650451582,0.17985727015446706,0.2662858683740275,0.30029824835816443],[0.10192000454850794,0.033102845734457216,0.04915068848494248,0.1603235336520356,0.12008232489373537,1,0.8474585514432418,0.27349903871656916,0.04208573652839889,0.09261343968112054,0.07130320239723914,0.04772930489637487],[0.11953149882183302,0.029698284345009665,0.08648333127233725,0.17104657047679664,0.12347227906880556,0.8474585514432418,1,0.3292849147157451,0.06155893537436332,0.10579153355326079,0.06664396727843398,0.04643696308220957],[0.2834902129405744,0.07269523960671254,0.10518094418915742,0.14001172140218957,0.14615857794356438,0.27349903871656916,0.3292849147157451,1,0.09325056754388406,0.14031262771156558,0.12404980816283194,0.12126252928640859],[0.15722505716992824,0.08891865469218782,0.08222913989540509,0.2354884902535023,0.1862443650451582,0.04208573652839889,0.06155893537436332,0.09325056754388406,1,0.8774163692562938,0.4253659098986262,0.43493372979480177],[0.17310249396821675,0.12367103665842975,0.14378829931809226,0.26437381869337956,0.17985727015446706,0.09261343968112054,0.10579153355326079,0.14031262771156558,0.8774163692562938,1,0.4697770008771968,0.4733429692792245],[0.06253368296671508,0.07605207088226057,0.09021504689028166,0.301659977077651,0.2662858683740275,0.07130320239723914,0.06664396727843398,0.12404980816283194,0.4253659098986262,0.4697770008771968,1,0.98261023578195],[0.07279099852951824,0.06907508038309863,0.10023098677716687,0.3097900080320079,0.30029824835816443,0.04772930489637487,0.04643696308220957,0.12126252928640859,0.43493372979480177,0.4733429692792245,0.98261023578195,1]]');
    console.log(cosine_similarity_matrix);

    let groups = this.form_groups(cosine_similarity_matrix);

    let html_groups = "";
    for(let i in groups){
      html_groups+="<br/><b>Group "+String(parseInt(i)+1)+"</b><br/>";
      for(let j in groups[i]){
        console.log(groups[i][j], list_sentences[ groups[i][j] ])
        html_groups+= list_sentences[ groups[i][j] ] + "<br/>";
      }
    }

    $("#output_resultshtml").html(html_groups);
    console.log(html_groups)

    // plot heatmap
    let colors = [];
    let base_color = 54;
    for(let i=0;i<=10;i++){
      colors.push([i/10, "rgb(0,"+(base_color+(i*20))+",0)"]);
    }

    let data = [
      {
        z: cosine_similarity_matrix,// [[1, 20, 30], [20, 1, 60], [30, 60, 1]],
        x: list_sentences,
        y: list_sentences,
        type: 'heatmap',
        colorscale: colors
      }
    ];
    let layout = {
        showlegend: false,
        width: $(div_heatmap).width(),
        height: $(div_heatmap).width()/2,
    };
    Plotly.newPlot('div_heatmap', data, layout);

    $('#load_fetch_data').hide();
  };

  $('#load_fetch_data').show();
  let embeddings = await this.get_embeddings(list_sentences, callback.bind(this));

}

onClickAnalyzeSentences();
