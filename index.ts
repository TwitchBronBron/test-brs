import * as fs from 'fs';
import * as brs from 'brs';
import * as Stopwatch from 'timer-stopwatch';

var fileContents = fs.readFileSync('rooibos.cat.brs').toString();

function doTest(testName: string, iterations, action: () => void) {
    console.log('\n\n', 'Testing', testName);
    var stopwatch = new Stopwatch();


    for (var i = 0; i < iterations; i++) {
        stopwatch.start();
        action();
        stopwatch.stop();
        //write progress percentage
        (process.stdout as any).cursorTo(0);
        var progressPercent = (i / iterations * 100).toFixed(0).padStart(2, '0');

        if (i > 0) {
            var averageMilliseconds = stopwatch.ms / i;
            process.stdout.write(
                progressPercent + '%' +
                ' (' + i.toString().padStart(iterations.toString().length, '0') + '/' + iterations + ')' +
                ' average ' + averageMilliseconds.toFixed(2) + 'ms  '
            );
        }
    }
    console.log('');

    console.log('Total milliseconds', stopwatch.ms);
    console.log('Average milliseconds', stopwatch.ms / iterations)
}

doTest("enum perf test", 1000, () => {
    var { tokens } = brs.lexer.Lexer.scan(fileContents);
    var { statements, errors } = brs.parser.Parser.parse(tokens);
    if (errors.length > 0) {
        // console.log(errors);
        throw new Error('File has errors');
    }
});
