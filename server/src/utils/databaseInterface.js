class MyInterface {
    // SELECT a column of a table
    select(db, table, column) {
      
    }
  
    // SELECT columns (defined by toBeSelected) of rows of the table WHERE column has value toBeFound
    selectWhere(db, table, column, value) {
      
    }
  
    // INSERT a single record
    insert(db, table, data) {
      
    }

    // UPDATE a record
    update(db, table, column, value, newColumn, newValue) {

    }
  
    // DELETE data from a table WHERE column value == value
    deleteFrom(supabaseDb, table, column, value) {
      
  }
}
  

export class SupabaseQueryClass {

  async select(supabaseDb, table, column) {
      try {
        // Select data from database
          const { data, error } = await supabaseDb
          .from(table)
          .select(column);
  
          if (error) {
            // If database operations produce an error, return it
            console.error("An error has occurred:", error);
            return { error };
          } else {
              return { data };
          }
      } catch (err) {
        // Catch error
          console.error("An error has been caught in select:", err);
          return { error: err };
      }
  }

  async selectWhere(supabaseDb, table, column, value) {
    try {
        // Select data from the database
        const { data, error } = await supabaseDb
            .from(table)
            .select("*")
            .eq(column, value);

        if (error) {
            // Log and return the error
            console.error(`An error occurred while selecting data from table '${table}' where '${column}' equals '${value}':`, error);
            return { data: null, error }; // Return null for data to indicate failure
        }

        // Return the retrieved data
        return { data, error: null };
    } catch (err) {
        // Log and return the caught error
        console.error(`An error occurred in selectWhere while querying table '${table}' where '${column}' equals '${value}':`, err);
        return { data: null, error: err };
    }
}

    async insert(supabaseDb, table, data) {
        try {
          // Insert data to the database
            const { error } = await supabaseDb
            .from(table)
            .insert(data)
            .select()

            if (error) {
              // If database operations produce an error, return it
                console.error(error)
                return { error }
              } else {
                console.log({ data })
                return { data }
              }
        }
        catch (err) {
          // Catch error
            console.log("An error has been caught in insert")
            console.error(err)
        }
    }
    
      async update(supabaseDb, table, column, value, newColumn, newValue) {
        console.log("The new value is: ", newValue)
        try {
          // Handle new input value being undefined
            if (newValue === undefined) {
                return { error: "The new value is undefined" };
            }
            
            // Initialise a new object
            const updatedTuple = {};
            // Assign new value to its corresponding column
            updatedTuple[newColumn] = newValue;
            
            // Update data in database
            const { data, error } = await supabaseDb
            .from(table)
            .update(updatedTuple)
            .eq(column, value);
    
            if (error) {
              // If database operations produce an error, return it
                console.error("An error has occurred with updating the tuple:", error);
                return { error };
            } else {
                console.log(`The update is successful, data: ${JSON.stringify(data)}`);
                return { data };
            }
        } catch (err) {
          // Catch error
            console.error("An error has been caught with updating the tuple:", err);
            return { error: err };
        }
    }

    async deleteFrom(supabaseDb, table, column, value) {
      try {
        // Delete data from the database
        const { error } = await supabaseDb
        .from(table)
        .delete()
        .eq(column, value);

        if (error) {
          // If database operations produce an error, return it
          return { error };
        } else {
          return { Message: "The deletion is successful" };
        }
      } catch (err) {
        // Catch error
        console.error(err);
        return { error: err };
      }
    }
    }

