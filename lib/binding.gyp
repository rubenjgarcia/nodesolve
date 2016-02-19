{
  "targets": [
    {
      "target_name": "lpsolve",
      "type": "static_library",
      "defines": [
        "YY_NEVER_INTERACTIVE",
        "PARSER_LP",
        "INVERSE_ACTIVE=INVERSE_LUSOL",
        "RoleIsExternalInvEngine"
      ],
      "include_dirs": [
        "lpsolve",
        "lpsolve/shared",
        "lpsolve/bfp",
        "lpsolve/bfp/bfp_LUSOL",
        "lpsolve/bfp/bfp_LUSOL/LUSOL",
        "lpsolve/colamd"
      ],
      "sources": [
        "lpsolve/lp_MDO.c",
        "lpsolve/shared/commonlib.c",
        "lpsolve/shared/mmio.c",
        "lpsolve/shared/myblas.c",
        "lpsolve/ini.c",
        "lpsolve/fortify.c",
        "lpsolve/colamd/colamd.c",
        "lpsolve/lp_rlp.c",
        "lpsolve/lp_crash.c",
        "lpsolve/bfp/bfp_LUSOL/lp_LUSOL.c",
        "lpsolve/bfp/bfp_LUSOL/LUSOL/lusol.c",
        "lpsolve/lp_Hash.c",
        "lpsolve/lp_lib.c",
        "lpsolve/lp_wlp.c",
        "lpsolve/lp_matrix.c",
        "lpsolve/lp_mipbb.c",
        "lpsolve/lp_MPS.c",
        "lpsolve/lp_params.c",
        "lpsolve/lp_presolve.c",
        "lpsolve/lp_price.c",
        "lpsolve/lp_pricePSE.c",
        "lpsolve/lp_report.c",
        "lpsolve/lp_scale.c",
        "lpsolve/lp_simplex.c",
        "lpsolve/lp_SOS.c",
        "lpsolve/lp_utils.c",
        "lpsolve/yacc_read.c"
      ],
      "direct_dependent_settings": {
        "include_dirs": ["lpsolve"]
      }
    }
  ]
}