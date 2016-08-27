(function () {

    var countryReportNames = {
        '1': 'Polio',
        '2': 'Neonatal-tetanus-elimination',
        '3': 'Measles-elimination',
        '4': 'Rubella-elimination',
        '5': 'DTP3cv',
        '6': 'all-vaccines',
        '7': 'New-vaccines',
        '8': '',
        '9': 'NITAG',
        '10': 'Government-financing'
    };

    var goals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        subgoals = {
            '1': ['1a', '1b', '1c', '1d'],
            '2': ['2a', '2b', '2c', '2d'],
            '3': ['3a', '3b', '3c', '3d', '3e'],
            '4': ['4a', '4b'],
            '5': ['5a', '5b', '5c', '5d', '5e'],
            '6': ['6a'],
            '7': ['7a'],
            '8': ['8a'],
            '9': ['9a'],
            '10': ['10a']
        };

    var countriesData = {},
        areas,
        indicators,
        countryISOs = [];


    function row(d) {
     
        if (d.Name == "Area") {
            areas = d;
        } else if (d.Name == "Indicator") {
            indicators = d;
        } else {
            countriesData[d.ISO] = d;
            countryISOs.push(d.ISO);
        }
    }

    d3.csv('data/gvap_priority_data.csv', row, function (d) {
        console.log(areas)
        countryISOs.sort().forEach(function (iso) {    
            createViz(iso);
        });
        console.log(countriesData)

        d3.select('#goals svg').insert('hr', 'g').text('goals').attr('class', 'goals-label');

        d3.selectAll('.viz').insert('hr', 'svg').insert('div', 'svg').text('indicators').attr('class', 'indicator-label');

        d3.select('#goals')
            .append('svg')
            .style('width', 300)
            .style('height', 520);

        var goalNames = [];

        goals.forEach(function (goal) {
            goalNames.push(areas[subgoals[goal][0]])
        });

        d3.select('#goals svg')
            .append('g')
            .selectAll('text')
            .data(goalNames)
            .enter()
            .append('text')
            .text(function (d, i) {
                return String(i + 1) + '. ' + d;
            })
            .attr('x', 290)
            .attr('y', function (d, i) {
                return (i + 1) * 45 + 14;
            })
            .call(wrap, 290)
            .attr('text-anchor', 'end');

        addUI();

    }); // end d3.csv()

    function createViz(iso) {

        d3.select('body section')
            .insert('div', "#infoPanel")
            .attr('class', 'viz')
            .attr('id', iso + '-viz')
            .append('h2')
            .html(countriesData[iso].Name);

        d3.select('#' + iso + '-viz')
            .append('svg')
            .style('width', 220)
            .style('height', 520);



        goals.forEach(function (goal) {

            d3.select('#' + iso + '-viz svg')
                .append('g')
                .attr('class', 'goal')
                .selectAll('rect')
                .data(subgoals[goal])
                .enter()
                .append('rect')
                .style('width', 40)
                .style('height', 40)
                .style('rx', 5)
                .style('ry', 5)
                .style('x', function (d, i) {
                    return i * 45;
                })
                .style('y', function (d, i) {
                    return (goal - 1) * 45;
                })
                .style('fill', function (d, i) {
                    return countriesData[iso][d + '-color'];
                })
                .attr('class', function (d, i) {
                    return 'unit ' + subgoals[goal][i]
                })

            // }); // end forEach subgoals


        }); // end forEach goals

    } // end createViz

    function addUI() {

        d3.selectAll('.viz')
            .on('mouseover', function () {
                d3.selectAll('.viz')
                    .transition()
                    .duration(100)
                    .style('opacity', '.6');
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style('opacity', '1')
            })
            .on('mouseout', function () {
                d3.selectAll('.viz')
                    .transition()
                    .duration(100)
                    .style('opacity', '1');
            });

        d3.selectAll('.viz')
            .on('click', function () {
                countryDetails(d3.select(this).attr('id').slice(0, -4))
            })

        d3.select('#allCountries').on('click', function () {

            d3.selectAll('.viz').style('width', '220px');
            d3.selectAll('.viz svg').style('width', '220');
            d3.selectAll('.goals-label').style('display', 'none');

            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 0);

            d3.selectAll('.viz')
                .style('display', 'block')
                .style('opacity', '1');

            d3.select('#infoPanel')
                .style('display', 'none');

            d3.selectAll('svg .unit')
                .on('mouseover', null);

            d3.select('#download-goals')
                .style('display', 'none');

            d3.selectAll('#download-goals a').remove();


        });


        d3.select('body section')
            .insert('div', '#allCountries')
            .attr('id', 'download-goals')
            //        .insert('hr', 'svg')
            .insert('div', 'svg')
            .text('report')
            .attr('class', 'download-report-label')
            .attr('class', 'download-report-label');


        var sectionContainer = d3.select('section');

        window.onscroll = function () {

            var sectionContainerTop = sectionContainer.node().getBoundingClientRect().top;

            if (sectionContainerTop < -1600) {
                d3.select('#goals').style('padding-top', '1635px');
                d3.select('#goals span').style('padding-top', '1635px');
            } else if (sectionContainerTop < -1040) {
                d3.select('#goals').style('padding-top', '1090px');
                d3.select('#goals span').style('padding-top', '1090px');
            } else if (sectionContainerTop < -475) {
                d3.select('#goals').style('padding-top', '545px');
                d3.select('#goals span').style('padding-top', '545px');
            } else {
                d3.select('#goals').style('padding-top', '0');
                d3.select('#goals span').style('padding-top', '0');
            }
        };

        d3.select('.animated-map')
            .on('click', function () {
                if (!d3.select(this).classed('selected')) {
                    d3.select(this).attr('class', 'selected');
                    d3.select('section').style('display', 'none');
                    d3.select('#animated-map').style('display', 'block');
                } else {
                    d3.select(this).attr('class', '');
                    d3.select('section').style('display', 'block');
                    d3.select('#animated-map').style('display', 'none');
                }
            })


    } // end addUI

    function countryDetails(iso) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;


        var generateLocalPunchCardPath = function (d) {
            return './images/punch_cards/' + iso + '.png';
        }

        var generateLocalPath = function (d) {
            return './data/country_reports/' + iso +
                '/' + iso + '-' + countryReportNames[d] + '.docx';
        }

        d3.select('#download-goals')
            .style('display', 'inline-block')
            .selectAll('a')
            .data([1,2,3,4,5,5.2,6,7,8,9,10])
            .enter()
            .append('a')
            .attr('class', function(d) {
                if(d === 5) {
                    return 'double';
                } else {
                    return '';
                }
            })
            .attr('href', function (d) {

                if (d === 8) {
                    //                return generateLocalPunchCardPath(d);
                    return 'http://mdgs.un.org/unsd/mdg/Resources/Static/Products/Progress2015/Snapshots/' + iso + '.pdf';
                } else if(d === 5.2) {
                    return generateLocalPunchCardPath(5);
                } else {
                    return generateLocalPath(d);
                }
            })
            .attr('target', '_blank')
            .append('img')
            .attr('src', function(d) {
                if(d === 5.2) {
                    return './images/punchcard.png';
                } else {
                    return './images/download.png';
                }
            })
            .attr('alt', 'download report');

        d3.select('#allCountries')
            .transition()
            .duration(200)
            .style('opacity', 1);

        var area = d3.select('#area'),
            indicator = d3.select('#indicator'),
            value = d3.select('#value'),
            indicatorWindow = d3.select('#indicator-window');

        d3.selectAll('.viz').style('display', 'none');

        d3.select('#' + iso + '-viz')
            .style('display', 'block');


        d3.selectAll('#' + iso + '-viz svg .unit')
            .on('mouseover', function (d) {

                var coords = d3.select(this).node().getBoundingClientRect(),
                    x = coords.left + 35,
                    y = coords.top - indicatorWindow.node().getBoundingClientRect().height - 45;

                indicatorWindow.style('display', 'inline-block');
                indicatorWindow.style('left', x + "px");
                indicatorWindow.style('top', y + "px");

                var currentCountryData = countriesData[iso];
                indicator.html(indicators[d]);
                value.html(currentCountryData[d]);
                value.style('color', d3.select(this).style('fill'))
                d3.selectAll('.unit')
                    .transition()
                    .duration(100)
                    .style('fill-opacity', '.6');

                d3.select(this)
                    .transition()
                    .duration(100)
                    .style('fill-opacity', '1');
            })
            .on('mouseout', function (d) {
                d3.selectAll('.unit').style('fill-opacity', '1');
                indicatorWindow.style('display', 'none');
            });

        d3.select('#full-report')
            .attr('href', './data/country_reports/' + iso + '/' + iso + '-Full-Report.docx');
        d3.select('#immunization-schedule')
            .attr('href', './data/country_reports/' + iso + '/' + iso + '-Immunization-schedule.docx');
        d3.select('#who-monitoring').attr('href', 'http://apps.who.int/immunization_monitoring/globalsummary/countries?countrycriteria%5Bcountry%5D%5B%5D=' + iso).attr('target', '_blank');


        d3.select('#gni').html(countriesData[iso]['GNI 2014']);
        d3.select('#wb-status').html(countriesData[iso]['WB Status']);
        d3.select('#infant-morality').html(countriesData[iso]['Infant mortality (<12 M) 2015 UN IAG CME']);
        d3.select('#gavi').html(countriesData[iso]['Gavi Status']);
        d3.select('#total-pop').html(countriesData[iso]['Total Population']);
        d3.select('#birth-cohort').html(countriesData[iso]['Birth Cohort']);
        d3.select('#surviving-infants').html(countriesData[iso]['Surviving Infants (JRF)']);

        d3.select('#infoPanel').style('display', 'inline-block');

    }

    function wrap(text, width) {
        // adapted from bostock's example: https://bl.ocks.org/mbostock/7555321

        text.each(function () {
            try {


                var text = d3.select(this),
                    words = d3.select(this).html().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = 0, //parseFloat(text.attr("dy")),
                    tspan = text.text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
                    }
                }


            } catch (e) {

                console.log(e)
            }
        });
    }

})();