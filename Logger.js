const chalk = require( "chalk" );

function Error( ...args )
{
	// console.error(
	// 	chalk.red("[ERROR]: ")
	// );
	let string = "";
	args.forEach( ( element ) =>
	{
		// process.stderr.write(element + " ");
		string += element + " ";
	} );
	console.error( chalk.red( "[ERROR]:" ), string );
	process.exit( 1 );
}
// Error("Hello", 4)
exports.Error = Error;
