/*
jquery.percentageloader.js 
 
Copyright (c) 2012, Better2Web
All rights reserved.

This jQuery plugin is licensed under the Simplified BSD License. Please
see the file license.txt that was included with the plugin bundle.

*/

/*global jQuery */

(function ($) {
    /* Strict mode for this plugin */
    "use strict";
    /*jslint browser: true */

    /* Our spiral gradient data */
    var imgdata = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDM4RjdFNzQ5MzAyMTFFMUFFQTdENUVDNDUwOEI2RUYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDM4RjdFNzU5MzAyMTFFMUFFQTdENUVDNDUwOEI2RUYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMzhGN0U3MjkzMDIxMUUxQUVBN0Q1RUM0NTA4QjZFRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMzhGN0U3MzkzMDIxMUUxQUVBN0Q1RUM0NTA4QjZFRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv4BSzoAAA+OSURBVHja1F1bkutK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",
        gradient = new Image();
        gradient.src = imgdata;
    var imgdata2="data:image/jpg;base64,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",   
        gradient2 = new Image();
        gradient2.src = imgdata2;
    var imgdata3="data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCACkAKMDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAoopDQAE0ZqC6u4LS3ee5lSKFBlndsKB7mvP9c+I+d0GjQ7scfaJV4/Bf6n8q0hSlPZGlOlOo7I9AuLyC1iMs8yRRr1Z2AA/OuZv/iJotoSsDyXb/8ATFePzOB+VeW3l7d6lP519cyXD9t5yB9B0H4VEAAMdvSuuOES+Jnr0Mri9Zs7m5+Jt23/AB7abEg7GVyx/QAfrWfJ8QNfkPBtYx6LDn+ZrmAMcAYz6VZhs5ZBnAVfUir9hHoj2KWX4WK1h95tr478Qg/6+3P1hFXIPiJrCEebBaSD2Ur+uaxYrGFfvAsfer0cUa42oo/Cm8PHsXPCYS38M6Sz+I8TkC8sJE9WibeP5Cuk0/xLpWpkLb3aeYf+Wbna35GuBRVPYVJ9khlGHiQj6Vzzw6Wx5dbLcO17ujPTw2ehpc1wlhfXmn4EU7PGP+WcrFgB7HqK6mw1eG8AU/u5cfdbv9PWuZwaPHr4SdLXdGnmikByaWpOUKKKKACiiigAoopCcUgAnFZGu+IbPQbLz7ptztkRxJ96Q+g/xo8ReILXw9prXU53OTtiiHWRvQV4rqWo3esXz3t9IXlc8Dso9AOwFduEwkqzu9hrct634gv/ABBcebdPtiU/u4EPyp/ifc1nKAAMD8KaDk80teuoKCtFHpUJpaIeOwqSKNpXCoMmohkkADJPAFbtpbC2iC9ZCPmNZyR6tGY23so4Blhuk9fSrBPrzQTTCalaHfB3HqanSqqHmrSGomy5LQtR1ajqtHVyIVxzkctQnjHtVhYx1HB68VHGKsxjpXJOZxVGathqbxkRXJyvRXPb61tq27kHiuV7YFX9PvvIZYZD+7PQn+GsPaHlYih9qJu0UgOeaWtDhCiiigAqG4njtbeSeZgscalmY9gBk1Ka5HxrqGNKurSM/wDLFmk/oP6/lWlKm6k1FGdWoqceZnmmv65P4h1Z7yXKxL8sMR/gX/Hpms4cCmgYGP8AP+f8aUGvp4U1CKiuhzwrXdxwopAaM80mjvo1jS0yEO7TEcLwv1rUJqC2QQ2yJjBA5+tSE1zSPaoVBS1MJoJppNZs9eg7j061bjqkh57/AJVoWsE0pHlxO30Wsaj0N6jSWrLUQq7H2pIdMvD/AMsD+JFXF0+6QcwP+AzXnVZM86pWh3CMcVYU4FRBShwwKn0IxUg4FcU5HLJp7EoNOwPrUYNPFYOZm0a+l3hb9xI2WA+UnuK1M1ywdo2V1OGU5FdJbTCeBZB3Fb0anNoeZiaXK+ZbEtFLRW5zEVxMsFvJK/3UUsfwFeba1M9zpd/M5y8kbE/5+ldh4puvK0xYVPzTOF/Dqf5Vxt4BJp08Y/iiYD8q9LBU7LnPCzPEfvVBdDgz1NJS0le4EKouafAN86L71HU1pxcKfSlLY66dexub80hPvVbfx1qSBJbydLe3jaSWQ4VV61zSikrs9jDYpCtIAM5wPU1dstLu73DJFJ5f94ITn6V2eh+CbW1VZ9RxcXPXb/Ah9B6/WurSJI1CogUDpgV5lTGRTtFHp/2p7NWirnnlpo7WpDPZTH/aeMmtq3YZAwB7Hj9K6wgHtUE1lBMPmjXPqBzWEsU5bownmEqj99GbCAe36VeQgDpVc2xtveP1p4auaczCTUtiVkSQYZQR7iqc2mQsCY8ofQdKtBqXdXPJp7ijKUdmYc1tJAfnHH94cimZrdbawIYZBrNurPyyXjHy+npXJVjy6o6qdbm0kVuorS0efDvAe/K1mjpTreXybmOTPRhn6VhSrcs0yqseeDR1FFIDxzRXsXR5NmcZ4vn/AOJhbw54RC35n/61YPmduKueKpc+I51J+6iKPyz/AFrI8yvboK1OJ8ljG3iJvzOXniMVxJHz8rEc+nao8VparFi5Eo+7IKoEV3xnoXGWhGafAcTLRtpQMEH0quZFqo0WWcgEjsDXp3gXQVstNXUZ1/0u5UMM9VTsPx4NeaWFsL7VLO0PSaZEP0JGf0zXvEahEVQAABgAV5eY1rJQR6mAbldsUKBS4oFLXkHphikxS0UANdQy4PINZcgMMpQnI6qfatU1Q1JcKknocfhWNbSPMa0n71iLdxRuqAPS768917nVyk2+l3A8etQb6TfU+2DkKlxH5UmR91uRVduRWhMN8ZHfqKzzx9a4qr5XdHVTd1Y6a1fzLWJ/VRRVbTJP+JdCPQEfqaK9mE/dR5covmZ5/wCK2K+KbvPon/oIrIMnvWt45Uw+J2Y9JYUYfqP6Vz/mV9JRl+7R8fio2rz9SS5UTRFepHK1lAe1aO/3qvKgLFh0NaqpYyi7aFfFG2pAKXbQ6yK5i74dITxNphbp9oUfnwK9uB74rwZC8MqTRnEkbB1+oOf6V7hpt7HqGnwXUZ+SVAw9vb8K83FT55Jnr5ZUTUo9S3S0gpa5D1wooooADWfqrbbT6sAKvmsPWrkGWOAH7vzN/SuTG1FTou/Uun8SIPMo8yqpk96PM96+b9ud/MmW99Jvqr5lHme9P2xaaLXmVTnwrt6HmneZ71FcMCoPoKidTmRUHZm3pak6dEf97+ZoqxpUe3TIAw525P4nNFe/CL5UefKfvM4v4lW2yTT70DAO6Fj+o/rXDCTI616342006l4Xu1RS0sI85APVef5ZFeMpKCuQQc9x3/zmvfo1LRsfL5jTcavN3LgfnrRvqsH96XdTlWPPZZGCeKcBVdXqeOUHg8GuedfzJJNmR711Xg/xCNKc2N0wFrI5ZGPOxjjj2HWubUA9D+NSiPI5Arhq4i2ppQrSoz5kezxuHAZSCpGRin5rzHSPEN/pICAie3H/ACzkP3R7Gurt/GNhKo85ZIWPYqT/ACqI42k93Zn0VHH0ZrV2Z0W7mlJrFbxRpSqSJyx9Ah/wrMvPGIYFLKE5I+/Jxj8KVXHUKau5G7xFNdTf1HUorCDc5Bc8Ig6sa5U3DyyvJIcuxy1ZzXEtxKZp5DI56sf6VKsnGO1fN43HzxEkkrJEwxCbui28uCKQS1ReYFzg8CgS+9cHM+p2Qrl/zfel8yqPm0vm+9PmOiNQu+bTJGMgCDq3A/Gqvm+9X9EjN5qkY6rF87fh/wDXxW1BOpUjBdTR1Elc7KJBFCiZ+6AKKeAMDNFfaRppJI4GwcAqQeh65rwbxLpTaF4iubLGIWYywH1Rjn9DkfhXvRGRXH/EHw22t6MLm2QtfWmXjAHLr/Ev6DHuPetOZrY4cdQ9rTut0eRh6eGqnHKGUHPUVKGrnnXPnGu5ZDVKGzVVWqVWrjqVrkMuRSsn3WIq3HdMOoBrOU1MrVw1arJuaaXX+z+tSrcHHAUfrWcje9Tqwrz6krgptF0SE9TT0fFUw9PV/euRlwqa6mgkvTPapHuRGme/aqAl2gseAKqy3JlfOeB0qHG53xxFkaAnz3qQTVmLL71Is1FjrpYq5oianCXNZ4m96d52Oc1Nj0KeIuXnmCqSTgdzXZ+FbIw6d9pkBWS4O7B7L2ri9Hsn1nVUtwD5KfPMewUdvxr1JFCgKBgAYA9K9/J8K2/azW2x1e0uh2KKKK+jJsLTXGVIPSnUhGaAPHfiF4TbSrqTWbGImymbM6KOInPVv90/ofrXFq2R7etfSM8Ec8DQzIHjcFWVhkEHsa8W8YeCp/Dsz3lkjSaWx/G39j6r6H/9dcGKpNe9E8TH4Nq9SmvU5xTUqmqyMCAamU15U5niyfcso1ToaqKamRq5ZyM3Itq1Sq1VVapA3Fc0ncz5iyGpxkAGScCqT3SR9DuPtVWS4aQ8nA9KhRbGpF2W6MhwDhaaJKpB/eniSm4msZl0Se9P80jvVISU/wAwAdamx0xnYuCanxGa7uY7W1QyTSnair1/H2qjCs95cx2trE000hwqKOT/APW9TXq/hLwrHocBnuCst/IPncDhf9lfau3CYCVeWuiPVwkZ1H5F/wAO6JHomnrCGDzuA00g/ib/AAHatjFAGKWvq4QjCKiuh7CVlYTFFLRVWGFFFFMBCKZJGksbI6hlYYKsMgipKKAPK/FPw2aIyXugJlerWef/AEAn+RP09D5wb2OCd7ecPDPGcPHIhVkPoQea+mcCsPxD4Q0XxLDt1G0VpAMLOh2yL9CP65FcFfAQqax0Z5eIyyFS8o6M8IW9gP8Ay0/IVIL6EdCT9BXR6z8I9XsWaTSbqO+h7RykRyAfX7p/SuNu7HUtKk8vUbG5tm/6axkD8D0P4GvIq4OUHqjxa2BqU/iRo/bv7qfmaabmSTq3HpWbHOhAIYfnVgSDua5HC3Q4nBroWQ1G4VB5i+o/OgyKO+fpU8pNiwGpweqfnruCrkseg7/lW5pnhLxDq5UwafJDEf8Alrcgxj9eT+ArSNCc37qN6VGpN+6ih5oXrWpoehan4jm22UJW3Bw9y4Oxfp/ePsK7jRPhfY2rJNq05vZRz5YG2MH6dT+Y+ld5FBFbxJFEixxoMKqjAA+lelh8q+1VZ7WGyx35qrMbw74WsPD8GIAZLhx+9nf7zH+g9q3gMUgA3U6vahTjBcsUe1CCgrJBRRRVlBRRRQAUUUUAFFFFAB3pCAaKKGJhj60ySGOVCkiK6kYIYZBoopPYHqYN94J8N32Wm0i2DHq0a+WT/wB84rJk+F/hhj+7t7iIeiTt/XNFFcdSEexx4inC+yI0+FvhwHn7a31uDV63+HPheEgnTvNI/wCesrt+mcUUVNOnC+xlSpQv8KN6x0TS9OH+hafbW/8A1yiVf5Cr2wA8DFFFdsElsehCKWyFxRRRVFdRe9FFFABRRRQAUUUUAf/Z",
        gradient3=new Image();
        gradient3.src = imgdata3;
    /** Percentage loader
     * @param	params	Specify options in {}. May be on of width, height, progress or value.
     *
     * @example $("#myloader-container).percentageLoader({
		    width : 256,  // width in pixels
		    height : 256, // height in pixels
		    progress: 0,  // initialise progress bar position, within the range [0..1]
		    value: '0kb'  // initialise text label to this value
		});
     */
    $.fn.percentageLoader = function (params) {
        var settings, canvas, percentageText, valueText, items, i, item, selectors, s, ctx, progress,
            value, cX, cY, lingrad, innerGrad, tubeGrad, innerRadius, innerBarRadius, outerBarRadius,
            radius, startAngle, endAngle, counterClockwise, completeAngle, setProgress, setValue,
            applyAngle, drawLoader, clipValue, outerDiv,startRect;

        /* Specify default settings */
        settings = {
            width: 256,
            height: 256,
            progress: 0,
            //value:"",
            value: '0kb'
        };

        /* Override default settings with provided params, if any */
        if (params !== undefined) {
            $.extend(settings, params);
        }

        outerDiv = document.createElement('div');
        outerDiv.style.width = settings.width + 'px';
        outerDiv.style.height = settings.height + 'px';
        outerDiv.style.position = 'relative';
        outerDiv.style.margin="0 auto";

        $(this).append(outerDiv);

        /* Create our canvas object */
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', settings.width);
        canvas.setAttribute('height', settings.height);
        outerDiv.appendChild(canvas);

        /* Create div elements we'll use for text. Drawing text is
         * possible with canvas but it is tricky working with custom
         * fonts as it is hard to guarantee when they become available
         * with differences between browsers. DOM is a safer bet here */
        percentageText = document.createElement('div');
        percentageText.style.width = (settings.width.toString() - 2) + 'px';
        percentageText.style.textAlign = 'center';
        percentageText.style.height = '50px';
        percentageText.style.left = 0;
        percentageText.style.position = 'absolute';

        valueText = document.createElement('div');
        valueText.style.width = (settings.width - 2).toString() + 'px';
        valueText.style.textAlign = 'center';
        valueText.style.height = '0px';
        valueText.style.overflow = 'hidden';
        valueText.style.left = 0;
        valueText.style.position = 'absolute';

        /* Force text items to not allow selection */
        items = [valueText, percentageText];
        for (i  = 0; i < items.length; i += 1) {
            item = items[i];
            selectors = [
                '-webkit-user-select',
                '-khtml-user-select',
                '-moz-user-select',
                '-o-user-select',
                'user-select'];

            for (s = 0; s < selectors.length; s += 1) {
                $(item).css(selectors[s], 'none');
            }
        }

        /* Add the new dom elements to the containing div */
        outerDiv.appendChild(percentageText);
        outerDiv.appendChild(valueText);

        /* Get a reference to the context of our canvas object */
        ctx = canvas.getContext("2d");


        /* Set various initial values */

        /* Centre point */
        cX = (canvas.width / 2) - 1;
        cY = (canvas.height / 2) - 1;

        /* Create our linear gradient for the outer ring */
        lingrad = ctx.createLinearGradient(cX, 0, cX, canvas.height);
        lingrad.addColorStop(0, '#d6eeff');
        lingrad.addColorStop(1, '#b6d8f0');

        /* Create inner gradient for the outer ring */
        innerGrad = ctx.createLinearGradient(cX, cX * 0.133333, cX, canvas.height - cX * 0.133333);
        innerGrad.addColorStop(0, '#f9fcfe');
        innerGrad.addColorStop(1, '#d9ebf7');

        /* Tube gradient (background, not the spiral gradient) */
        tubeGrad = ctx.createLinearGradient(cX, 0, cX, canvas.height);
        tubeGrad.addColorStop(0, '#c1dff4');
        tubeGrad.addColorStop(1, '#aacee6');

        /* The inner circle is 2/3rds the size of the outer one */
        innerRadius = cX * 0.6666;
        /* Outer radius is the same as the width / 2, same as the centre x
        * (but we leave a little room so the borders aren't truncated) */
        radius = cX - 2;

        /* Calculate the radii of the inner tube */
        innerBarRadius = innerRadius + (cX * 0.06);
        outerBarRadius = radius - (cX * 0.06);

        /* Bottom left angle */
        startAngle = 2.1707963267949;
        /* Bottom right angle */
        endAngle = 0.9707963267949 + (Math.PI * 2.0);

        /* Nicer to pass counterClockwise / clockwise into canvas functions
        * than true / false */
        counterClockwise = false;

        /* Borders should be 1px */
        ctx.lineWidth = 1;

        /**
         * Little helper method for transforming points on a given
         * angle and distance for code clarity
         */
        applyAngle = function (point, angle, distance) {
            return {
                x : point.x + (Math.cos(angle) * distance),
                y : point.y + (Math.sin(angle) * distance)
            };
        };


        /**
         * render the widget in its entirety.
         */
        drawLoader = function () {
            /* Clear canvas entirely */
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            /*** IMAGERY ***/
            if(params.shape==1){
            /* draw outer circle */
            ctx.fillStyle = lingrad;
            ctx.beginPath();

            ctx.strokeStyle = '#65F3B5';
            ctx.arc(cX, cY, radius, 0, Math.PI * 2, counterClockwise);
            ctx.fill();
            ctx.stroke();

            /* draw inner circle */
            ctx.fillStyle = innerGrad;
            ctx.beginPath();

            ctx.arc(cX, cY, innerRadius, 0, Math.PI * 2, counterClockwise);
            ctx.fill();
            ctx.strokeStyle = '#b2d5edaa';
            ctx.stroke();

            ctx.beginPath();
             }
            /**
             * Helper function - adds a path (without calls to beginPath or closePath)
             * to the context which describes the inner tube. We use this for drawing
             * the background of the inner tube (which is always at 100%) and the
             * progress meter itself, which may vary from 0-100% */
            function makeInnerTubePath(startAngle, endAngle) {
                var centrePoint, startPoint, controlAngle, capLength, c1, c2, point1, point2;
                centrePoint = {
                    x : cX,
                    y : cY
                };

                startPoint = applyAngle(centrePoint, startAngle, innerBarRadius);

                ctx.moveTo(startPoint.x, startPoint.y);

                point1 = applyAngle(centrePoint, endAngle, innerBarRadius);
                point2 = applyAngle(centrePoint, endAngle, outerBarRadius);

                controlAngle = endAngle + (3.142 / 2.0);
                /* Cap length - a fifth of the canvas size minus 4 pixels */
                capLength = (cX * 0.20) - 4;

                c1 = applyAngle(point1, controlAngle, capLength);
                c2 = applyAngle(point2, controlAngle, capLength);

                ctx.arc(cX, cY, innerBarRadius, startAngle, endAngle, false);
                ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point2.x, point2.y);
                ctx.arc(cX, cY, outerBarRadius, endAngle, startAngle, true);

                point1 = applyAngle(centrePoint, startAngle, innerBarRadius);
                point2 = applyAngle(centrePoint, startAngle, outerBarRadius);

                controlAngle = startAngle - (3.142 / 2.0);

                c1 = applyAngle(point2, controlAngle, capLength);
                c2 = applyAngle(point1, controlAngle, capLength);

                ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point1.x, point1.y);
            }
            function makeInnerRectPath(start,end){
                /*ctx.moveTo(10,0);
                ctx.lineTo(start-10,0);
                ctx.lineTo(start-10,end);
                ctx.lineTo(10,end);*/
                ctx.moveTo(10,end/2+10);
                ctx.lineTo(start-10,end/2+10);
                ctx.quadraticCurveTo(start, end/2+15, start-10,end/2+20)
                //ctx.lineTo(start-10,end/2+40);
                ctx.lineTo(10,end/2+20);
                ctx.quadraticCurveTo(0, end/2+15, 10,end/2+10)
                ctx.closePath();
            }
            /* Background tube */
            ctx.beginPath();
            ctx.strokeStyle = '#bcd4e5';
            if(params.shape==1||params.shape==2){
                makeInnerTubePath(startAngle, endAngle);
            }else if(params.shape==3){
                makeInnerRectPath(canvas.width,canvas.height)
            }
            ctx.fillStyle = tubeGrad;
            ctx.fill();
            ctx.stroke();

            /* Calculate angles for the the progress metre */
            completeAngle = startAngle + (progress * (endAngle - startAngle));
            startRect=progress*(canvas.width-20)+20;
              //startRect=canvas.width-20;
            ctx.beginPath();
            if(params.shape==1||params.shape==2){
                makeInnerTubePath(startAngle, completeAngle);
            }else if(params.shape==3){
                makeInnerRectPath(startRect,canvas.height)
            }
            /* We're going to apply a clip so save the current state */
            ctx.save();
            /* Clip so we can apply the image gradient */
            ctx.clip();
            
            /* Draw the spiral gradient over the clipped area */
            if(params.shape==1||params.shape==2){
                ctx.drawImage(gradient3, 0, 0, canvas.width, canvas.height);
            }else if(params.shape==3){
                ctx.drawImage(gradient2, 0, 0, canvas.width, canvas.height);
            }
            //ctx.drawImage(gradient, 0, 0, canvas.width, canvas.height);

            /* Undo the clip */
            ctx.restore();

            /* Draw the outline of the path */
            ctx.beginPath();
            if(params.shape==1||params.shape==2){
                makeInnerTubePath(startAngle, completeAngle);
            }else if(params.shape==3){
                makeInnerRectPath(startRect,canvas.height)
            }
            ctx.stroke();

            /*** TEXT ***/
            (function () {
                var fontSize, string, smallSize, heightRemaining;
                /* Calculate the size of the font based on the canvas size */
                fontSize = cY / 2;

                percentageText.style.top = ((settings.height / 2) - (fontSize / 2)).toString() + 'px';
                percentageText.style.color = '#80a9c8';
                percentageText.style.font = fontSize.toString() + 'px BebasNeueRegular';
                percentageText.style.textShadow = '0 1px 1px #FFFFFF';

                /* Calculate the text for the given percentage */
               string = (progress * 100.0).toFixed(0) + '%';

                percentageText.innerHTML = string;

                /* Calculate font and placement of small 'value' text */
                smallSize = cY / 5.5;
                valueText.style.color = '#80a9c8';
                valueText.style.font = smallSize.toString() + 'px BebasNeueRegular';
                valueText.style.height = smallSize.toString() + 'px';
                valueText.style.textShadow = 'None';

                /* Ugly vertical align calculations - fit into bottom ring.
                 * The bottom ring occupes 1/6 of the diameter of the circle */
                heightRemaining = (settings.height * 0.16666666) - smallSize;
                valueText.style.top = ((settings.height * 0.8333333) + (heightRemaining / 4)).toString() + 'px';
            }());
        };
        
        /**
        * Check the progress value and ensure it is within the correct bounds [0..1]
        */
        clipValue = function () {
            if (progress < 0) {
                progress = 0;
            }

            if (progress > 1.0) {
                progress = 1.0;
            }
        };

        /* Sets the current progress level of the loader
         *
         * @param value the progress value, from 0 to 1. Values outside this range
         * will be clipped
         */
        setProgress = function (value) {
            /* Clip values to the range [0..1] */
            progress = value;
            clipValue();
            drawLoader();
        };

        this.setProgress = setProgress;

        setValue = function (val) {
            value = val;
            valueText.innerHTML = value;
        };

        this.setValue = setValue;
        this.setValue(settings.value);

        progress = settings.progress;
        clipValue();

        /* Do an initial draw */
        drawLoader();

        /* In controllable mode, add event handlers */
        if (params.controllable === true) {
            (function () {
                var mouseDown, getDistance, adjustProgressWithXY;
                getDistance = function (x, y) {
                    return Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
                };

                mouseDown = false;

                adjustProgressWithXY = function (x, y) {
                    /* within the bar, calculate angle of touch point */
                    var pX, pY, angle, startTouchAngle, range, posValue;
                    pX = x - cX;
                    pY = y - cY;

                    angle = Math.atan2(pY, pX);
                    if (angle > Math.PI / 2.0) {
                        angle -= (Math.PI * 2.0);
                    }

                    startTouchAngle = startAngle - (Math.PI * 2.0);
                    range = endAngle - startAngle;
                    posValue = (angle - startTouchAngle) / range;
                    setProgress(posValue);

                    if (params.onProgressUpdate) {
                        /* use the progress value as this will have been clipped
                         * to the correct range [0..1] after the call to setProgress
                         */
                        params.onProgressUpdate(progress);
                    }
                };

                $(outerDiv).mousedown(function (e) {
                    var offset, x, y, distance;
                    offset = $(this).offset();
                    x = e.pageX - offset.left;
                    y = e.pageY - offset.top;

                    distance = getDistance(x, y);

                    if (distance > innerRadius && distance < radius) {
                        mouseDown = true;
                        adjustProgressWithXY(x, y);
                    }
                }).mouseup(function () {
                    mouseDown = false;
                }).mousemove(function (e) {
                    var offset, x, y;
                    if (mouseDown) {
                        offset = $(outerDiv).offset();
                        x = e.pageX - offset.left;
                        y = e.pageY - offset.top;
                        adjustProgressWithXY(x, y);
                    }
                }).mouseleave(function () {
                    mouseDown = false;
                });
            }());
        }
        return this;
    };
}(jQuery));
