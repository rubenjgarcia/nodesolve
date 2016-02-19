nodesolve

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Use [LP Solve](http://lpsolve.sourceforge.net) from NodeJs. This module uses LP Solve 5.5.2

# Usage

**First of all, all the functions are 0-index instead of 1-index like in lpsolve**

Install the module using npm

````
npm install nodesolve
````

For more information see the JSDoc

# Build from source

1. Install node-gyp

```` 
npm install node-gyp -g
````

2. Build project files for your platform

````
node-gyp configure
````

3. Generate `lpsolve.node` file

````
node-gyp build
````

# Testing

To test the module use the test task from gulp

````
gulp test
```` 

# Attention!!!

This module is in alpha and the next methods aren't implemented yet

- add_column, add_columnex, str_add_column
- add_lag_con, str_add_lag_con
- add_SOS
- column_in_lp
- copy_lp
- default_basis
- del_column
- del_constraint
- dualize_lp
- free_lp
- get_anti_degen
- get_basis
- get_basiscrash
- get_bb_depthlimit
- get_bb_floorfirst
- get_bb_rule
- get_bounds_tighter
- get_break_at_value
- get_col_name, get_origcol_name
- get_column, get_columnex
- get_constr_type
- get_constr_value
- get_constraints, get_ptr_constraints
- get_epsb
- get_epsd
- get_epsel
- get_epsint
- get_epsperturb
- get_epspivot
- get_improve
- get_infinite
- get_lambda, get_ptr_lambda, get_lambda, get_ptr_lambda
- get_lp_index
- get_Lrows
- get_mat
- get_max_level, get_max_level
- get_maxpivot
- get_mip_gap
- get_nameindex
- get_negrange
- get_nonzeros
- get_Norig_columns
- get_Norig_rows
- get_obj_bound
- get_objective
- get_orig_index
- get_pivoting
- get_presolve
- get_presolveloops
- get_primal_solution, get_ptr_primal_solution, get_var_primalresult
- get_print_sol
- get_row, get_rowex
- get_row_name, get_origrow_name
- get_scalelimit
- get_scaling
- get_sensitivity_obj, get_ptr_sensitivity_obj, get_sensitivity_objex, get_ptr_sensitivity_objex
- get_sensitivity_rhs, get_ptr_sensitivity_rhs, get_dual_solution, get_ptr_dual_solution, get_var_dualresult
- get_simplextype
- get_solutioncount
- get_solutionlimit
- get_status
- get_statustext
- get_total_iter
- get_total_nodes
- get_var_branch
- get_var_priority, get_var_priority
- get_variables, get_ptr_variables
- get_working_objective
- guess_basis
- has_BFP
- has_XLI
- is_anti_degen
- is_constr_type
- is_debug
- is_feasible
- is_unbounded
- is_infinite
- is_integerscaling
- is_lag_trace
- is_nativeBFP
- is_nativeXLI
- is_negative
- is_obj_in_basis
- is_piv_mode
- is_piv_rule
- is_presolve
- is_scalemode
- is_scaletype
- is_semicont
- is_SOS_var
- is_trace
- is_use_names
- lag_solve
- print_constraints
- print_debugdump
- print_duals
- print_lp
- print_objective
- print_scales
- print_solution
- print_str
- print_tableau
- put_abortfunc
- put_bb_branchfunc
- put_bb_nodefunc
- put_logfunc
- put_msgfunc
- read_basis
- read_mps, read_freemps, read_MPS, read_freeMPS
- read_params
- read_XLI
- reset_basis
- reset_params
- set_anti_degen, get_anti_degen
- set_basis
- set_basiscrash
- set_basisvar
- set_bb_depthlimit
- set_bb_floorfirst
- set_bb_rule
- set_BFP
- set_XLI
- set_bounds_tighter
- set_break_at_value
- set_column, set_columnex
- set_col_name
- set_constr_type
- set_debug
- set_epsb
- set_epsd
- set_epsel
- set_epsint
- set_epsperturb
- set_epspivot
- set_epslevel
- set_unbounded
- set_improve
- set_infinite
- set_lag_trace
- set_mat
- set_maxpivot
- set_mip_gap
- set_negrange
- set_obj_bound
- set_obj_in_basis
- set_outputstream, set_outputfile
- set_pivoting
- set_preferdual
- set_presolve
- set_print_sol
- set_row, set_rowex
- set_row_name
- set_scalelimit
- set_scaling
- set_semicont
- set_sense
- set_simplextype
- set_solutionlimit
- set_trace
- set_use_names
- set_var_branch
- set_var_weights
- time_elapsed
- unscale
- write_basis
- write_mps, write_freemps, write_MPS, write_freeMPS, MPS_writefileex
- write_params
- write_XLI