#include <node.h>
#include "nan.h"

#include "lpsolve.h"
#include "lp_lib.h"

using namespace v8;

NAN_MODULE_INIT(init) {
    Nan::Set(target, Nan::New<String>("version").ToLocalChecked(), Nan::GetFunction(Nan::New<FunctionTemplate>(version)).ToLocalChecked());
    Nan::Set(target, Nan::New<String>("makeLP").ToLocalChecked(), Nan::GetFunction(Nan::New<FunctionTemplate>(makeLP)).ToLocalChecked());
    Nan::Set(target, Nan::New<String>("readLP").ToLocalChecked(), Nan::GetFunction(Nan::New<FunctionTemplate>(readLP)).ToLocalChecked());

    Local<Object> CONSTRAINT_TYPE = Nan::New<Object>();
    Nan::Set(CONSTRAINT_TYPE, Nan::New<String>("LE").ToLocalChecked(), Nan::New<Number>(1));
    Nan::Set(CONSTRAINT_TYPE, Nan::New<String>("GE").ToLocalChecked(), Nan::New<Number>(2));
    Nan::Set(CONSTRAINT_TYPE, Nan::New<String>("EQ").ToLocalChecked(), Nan::New<Number>(3));
    Nan::Set(target, Nan::New<String>("CONSTRAINT_TYPE").ToLocalChecked(), CONSTRAINT_TYPE);

    Local<Object> VERBOSITY = Nan::New<Object>();
    Nan::Set(VERBOSITY, Nan::New<String>("NEUTRAL").ToLocalChecked(), Nan::New<Number>(0));
    Nan::Set(VERBOSITY, Nan::New<String>("CRITICAL").ToLocalChecked(), Nan::New<Number>(1));
    Nan::Set(VERBOSITY, Nan::New<String>("SEVERE").ToLocalChecked(), Nan::New<Number>(2));
    Nan::Set(VERBOSITY, Nan::New<String>("IMPORTANT").ToLocalChecked(), Nan::New<Number>(3));
    Nan::Set(VERBOSITY, Nan::New<String>("NORMAL").ToLocalChecked(), Nan::New<Number>(4));
    Nan::Set(VERBOSITY, Nan::New<String>("DETAILED").ToLocalChecked(), Nan::New<Number>(5));
    Nan::Set(VERBOSITY, Nan::New<String>("FULL").ToLocalChecked(), Nan::New<Number>(6));
    Nan::Set(target, Nan::New<String>("VERBOSITY").ToLocalChecked(), VERBOSITY);

    Local<Object> STATUS = Nan::New<Object>();
    Nan::Set(STATUS, Nan::New<String>("NOMEMORY").ToLocalChecked(), Nan::New<Number>(-2));
    Nan::Set(STATUS, Nan::New<String>("OPTIMAL").ToLocalChecked(), Nan::New<Number>(0));
    Nan::Set(STATUS, Nan::New<String>("SUBOPTIMAL").ToLocalChecked(), Nan::New<Number>(1));
    Nan::Set(STATUS, Nan::New<String>("INFEASIBLE").ToLocalChecked(), Nan::New<Number>(2));
    Nan::Set(STATUS, Nan::New<String>("UNBOUNDED").ToLocalChecked(), Nan::New<Number>(3));
    Nan::Set(STATUS, Nan::New<String>("DEGENERATE").ToLocalChecked(), Nan::New<Number>(4));
    Nan::Set(STATUS, Nan::New<String>("NUMFAILURE").ToLocalChecked(), Nan::New<Number>(5));
    Nan::Set(STATUS, Nan::New<String>("USERABORT").ToLocalChecked(), Nan::New<Number>(6));
    Nan::Set(STATUS, Nan::New<String>("TIMEOUT").ToLocalChecked(), Nan::New<Number>(7));
    Nan::Set(STATUS, Nan::New<String>("PRESOLVED").ToLocalChecked(), Nan::New<Number>(9));
    Nan::Set(STATUS, Nan::New<String>("PROCFAIL").ToLocalChecked(), Nan::New<Number>(10));
    Nan::Set(STATUS, Nan::New<String>("PROCBREAK").ToLocalChecked(), Nan::New<Number>(11));
    Nan::Set(STATUS, Nan::New<String>("FEASFOUND").ToLocalChecked(), Nan::New<Number>(12));
    Nan::Set(STATUS, Nan::New<String>("NOFEASFOUND").ToLocalChecked(), Nan::New<Number>(13));
    Nan::Set(target, Nan::New<String>("STATUS").ToLocalChecked(), STATUS);

    LPSolve::Init(target);
}

NODE_MODULE(lpsolve, init);

void LPSolve::Init(Handle<Object> exports) {
	Local<FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(LPSolve::New);
	tpl->SetClassName(Nan::New<String>("lprec").ToLocalChecked());
	tpl->InstanceTemplate()->SetInternalFieldCount(1);

    Nan::SetPrototypeMethod(tpl, "name", LPSolve::name);
    Nan::SetPrototypeMethod(tpl, "addRowMode", LPSolve::addRowMode);
    Nan::SetPrototypeMethod(tpl, "obj", LPSolve::obj);
    Nan::SetPrototypeMethod(tpl, "objFn", LPSolve::objFn);
    Nan::SetPrototypeMethod(tpl, "objFnEx", LPSolve::objFnEx);
    Nan::SetPrototypeMethod(tpl, "objFnStr", LPSolve::objFnStr);
    Nan::SetPrototypeMethod(tpl, "maxim", LPSolve::maxim);
    Nan::SetPrototypeMethod(tpl, "binary", LPSolve::binary);
    Nan::SetPrototypeMethod(tpl, "intVar", LPSolve::intVar);
    Nan::SetPrototypeMethod(tpl, "resize", LPSolve::resize);
    Nan::SetPrototypeMethod(tpl, "rows", LPSolve::rows);
    Nan::SetPrototypeMethod(tpl, "columns", LPSolve::columns);
    Nan::SetPrototypeMethod(tpl, "rh", LPSolve::rh);
    Nan::SetPrototypeMethod(tpl, "rhRange", LPSolve::rhRange);
    Nan::SetPrototypeMethod(tpl, "rhVec", LPSolve::rhVec);
    Nan::SetPrototypeMethod(tpl, "rhVecStr", LPSolve::rhVecStr);
    Nan::SetPrototypeMethod(tpl, "constraint", LPSolve::constraint);
    Nan::SetPrototypeMethod(tpl, "constraintEx", LPSolve::constraintEx);
    Nan::SetPrototypeMethod(tpl, "constraintStr", LPSolve::constraintStr);
    Nan::SetPrototypeMethod(tpl, "bounds", LPSolve::bounds);
    Nan::SetPrototypeMethod(tpl, "upBound", LPSolve::upBound);
    Nan::SetPrototypeMethod(tpl, "lowBound", LPSolve::lowBound);
    Nan::SetPrototypeMethod(tpl, "breakAtFirst", LPSolve::breakAtFirst);
    Nan::SetPrototypeMethod(tpl, "verbose", LPSolve::verbose);
    Nan::SetPrototypeMethod(tpl, "timeout", LPSolve::timeout);
    Nan::SetPrototypeMethod(tpl, "solve", LPSolve::solve);
    Nan::SetPrototypeMethod(tpl, "solveSync", LPSolve::solveSync);
    Nan::SetPrototypeMethod(tpl, "variables", LPSolve::variables);
    Nan::SetPrototypeMethod(tpl, "writeLP", LPSolve::writeLP);
    Nan::SetPrototypeMethod(tpl, "delete", LPSolve::deleteLP);

	constructor.Reset(tpl->GetFunction());
}

NAN_METHOD(version) {
    int majorversion, minorversion, release, build;

    lp_solve_version(&majorversion, &minorversion, &release, &build);

    Local<Object> ret = Nan::New<Object>();

    ret->Set(Nan::New<String>("majorversion").ToLocalChecked(), Nan::New<Number>(majorversion));
    ret->Set(Nan::New<String>("minorversion").ToLocalChecked(), Nan::New<Number>(minorversion));
    ret->Set(Nan::New<String>("release").ToLocalChecked(), Nan::New<Number>(release));
    ret->Set(Nan::New<String>("build").ToLocalChecked(), Nan::New<Number>(build));

    info.GetReturnValue().Set(ret);
}

NAN_METHOD(makeLP) {
	if (info.Length() != 2) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("First argument should be a Number");
	}

	if (!(info[1]->IsNumber())){
	    return Nan::ThrowTypeError("Second argument should be a Number");
	}

	int rows = (int) (info[0]->Int32Value());
	int columns = (int) (info[1]->Int32Value());

	lprec *lp = ::make_lp(rows, columns);
	Local<Object> instance = Nan::New<Function>(constructor)->NewInstance();
	LPSolve* retobj = node::ObjectWrap::Unwrap<LPSolve>(instance);
	retobj->lp = lp;
	info.GetReturnValue().Set(instance);
}

NAN_METHOD(readLP) {
	if (info.Length() != 3) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsString())) {
	    return Nan::ThrowTypeError("First argument should be a String");
	}

	if (!(info[1]->IsNumber())) {
	    return Nan::ThrowTypeError("Second argument should be a Number");
	}

	if (!(info[2]->IsString())) {
	    return Nan::ThrowTypeError("Third argument should be a String");
	}

	String::Utf8Value str_filename(info[0]);
	FILE *filename = fopen(*str_filename, "r");
	int verbose = (int)(info[1]->Int32Value());
	String::Utf8Value str_lp_name(info[2]);
	char* lp_name = *str_lp_name;
	lprec * ret = ::read_lp(filename, verbose, lp_name);
	fclose(filename);
	Local<Object> instance = Nan::New<Function>(constructor)->NewInstance();
	LPSolve* retobj = node::ObjectWrap::Unwrap<LPSolve>(instance);
	retobj->lp = ret;
	info.GetReturnValue().Set(instance);
}

LPSolve::LPSolve() {

}

LPSolve::~LPSolve() {
	if (this->lp) {
		::delete_lp(this->lp);
	}
}

NAN_METHOD(LPSolve::New) {
	if (info.IsConstructCall()) {
		LPSolve* obj = new LPSolve();
		obj->Wrap(info.This());
		info.GetReturnValue().Set(info.This());
	} else {
		Local<Function> cons = Nan::New<Function>(constructor);
		info.GetReturnValue().Set(cons->NewInstance(0, 0));
	}
}

class LPSolveWorker : public Nan::AsyncWorker {
    public:
        LPSolveWorker(Nan::Callback *callback, lprec* lp) : Nan::AsyncWorker(callback), lp(lp) {}

        ~LPSolveWorker() {}

        void Execute () {
            res = solve(lp);
        }

        void HandleOKCallback () {
            Local<Value> argv[] = {
                Nan::Null(),
                Nan::New<Number>(res)
            };

            callback->Call(2, argv);
        }

    private:
        lprec* lp;
        int res;
};

NAN_METHOD(LPSolve::name) {
    if (info.Length() == 0) {
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    	char * ret = ::get_lp_name(obj->lp);
    	info.GetReturnValue().Set(Nan::New<String>(ret).ToLocalChecked());
    } else {
        if (info.Length() != 1){
    	    return Nan::ThrowError("Invalid number of arguments");
    	}

    	if (!(info[0]->IsString())) {
    	    return Nan::ThrowTypeError("First argument should be a String");
    	}

    	String::Utf8Value name(info[0]);
    	char* lpname = *name;
    	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    	MYBOOL ret = ::set_lp_name(obj->lp, lpname);
    	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
    }
}

NAN_METHOD(LPSolve::addRowMode) {
    if (info.Length() == 0) {
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::is_add_rowmode(obj->lp);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
    } else {
        if (info.Length() != 1){
            return Nan::ThrowError("Invalid number of arguments");
        }

        if (!(info[0]->IsBoolean())){
            return Nan::ThrowTypeError("First argument should be a Boolean");
        }

        MYBOOL turnon = (MYBOOL)(info[0]->BooleanValue());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::set_add_rowmode(obj->lp, turnon);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
    }
}

NAN_METHOD(LPSolve::obj) {
	if (info.Length() != 2){
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("First argument should be a Number");
	}

	if (!(info[1]->IsNumber())) {
	    return Nan::ThrowTypeError("Second argument should be a Number");
	}

	int colnr = (int)(info[0]->Int32Value());
	REAL value = (REAL)(info[1]->NumberValue());
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::set_obj(obj->lp, colnr, value);
	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::objFn) {
	if (info.Length() != 1) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsArray() || info[0]->IsNull())) {
	    return Nan::ThrowTypeError("First argument should be a Array of Numbers or NULL");
	}

	REAL* row;
	if (info[0]->IsArray()) {
		Handle<Array> row_handle = Handle<Array>::Cast(info[0]);
		int row_n = row_handle->Length();
		row = new REAL[row_n];
		for (int i = 0; i < row_n; i++) {
			row[i] = row_handle->Get(i)->NumberValue();
		}
	}

	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::set_obj_fn(obj->lp, row);
	if (info[0]->IsArray()) {
		delete row;
	}

	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::objFnEx) {
	if (info.Length() != 3) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("First argument should be a Number");
	}

	if (!(info[1]->IsArray() || info[1]->IsNull())) {
	    return Nan::ThrowTypeError("Second argument should be a Array of Numbers or NULL");
	}

	if (!(info[2]->IsArray() || info[2]->IsNull())) {
	    return Nan::ThrowTypeError("Third argument should be a Array of Numbers or NULL");
	}

	int count = (int)(info[0]->Int32Value());
	REAL* row;
	if (info[1]->IsArray()) {
		Handle<Array> row_handle = Handle<Array>::Cast(info[1]);
		int row_n = row_handle->Length();
		row = new REAL[row_n];
		for (int i = 0; i < row_n; i++) {
			row[i] = row_handle->Get(i)->NumberValue();
		}
	}

	int* colno;
	if (info[2]->IsArray()) {
		Handle<Array> colno_handle = Handle<Array>::Cast(info[2]);
		int colno_n = colno_handle->Length();
		colno = new int[colno_n];
		for (int i = 0; i < colno_n; i++) {
			colno[i] = colno_handle->Get(i)->Int32Value();
		}
	}

	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::set_obj_fnex(obj->lp, count, row, colno);
	if (info[1]->IsArray()) {
		delete row;
	}

	if (info[2]->IsArray()) {
		delete colno;
	}

	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::objFnStr) {
	if (info.Length() != 1) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsString())) {
	    return Nan::ThrowTypeError("First argument should be a String");
	}

	String::Utf8Value str_row_string(info[0]);
	char* row_string = *str_row_string;
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::str_set_obj_fn(obj->lp, row_string);
	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::maxim) {
	if (info.Length() != 0) {
	    if (!(info[0]->IsBoolean())){
            return Nan::ThrowTypeError("First argument should be a Boolean");
        }

	    MYBOOL maxim = (MYBOOL)(info[0]->BooleanValue());
        if (maxim) {
            LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
            ::set_maxim(obj->lp);
        } else {
            LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        	::set_minim(obj->lp);
        }
	} else {
	    LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        	MYBOOL ret = ::is_maxim(obj->lp);
        	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	}
}

NAN_METHOD(LPSolve::binary) {
    if (info.Length() > 2) {
        return Nan::ThrowError("Invalid number of arguments");
    }

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("Invalid type of arguments");
	}

	if (info.Length() == 1) {
        int colnr = (int)(info[0]->Int32Value());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::is_binary(obj->lp, colnr);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	} else {
    	if (!(info[1]->IsBoolean())) {
    	    return Nan::ThrowTypeError("Second argument should be a Boolean");
    	}

    	int colnr = (int)(info[0]->Int32Value());
    	MYBOOL must_be_bin = (MYBOOL)(info[1]->BooleanValue());
    	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    	MYBOOL ret = ::set_binary(obj->lp, colnr, must_be_bin);
    	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	}
}

NAN_METHOD(LPSolve::intVar) {
    if (info.Length() > 2) {
        return Nan::ThrowError("Invalid number of arguments");
    }

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("Invalid type of arguments");
	}

	if (info.Length() == 1) {
        int colnr = (int)(info[0]->Int32Value());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::is_int(obj->lp, colnr);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	} else {
    	if (!(info[1]->IsBoolean())) {
    	    return Nan::ThrowTypeError("Second argument should be a Boolean");
    	}

    	int colnr = (int)(info[0]->Int32Value());
        MYBOOL must_be_int = (MYBOOL)(info[1]->BooleanValue());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::set_int(obj->lp, colnr, must_be_int);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	}
}

NAN_METHOD(LPSolve::resize) {
	if (info.Length() != 2) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("First argument should be a Number");
	}

	if (!(info[1]->IsNumber())) {
	    return Nan::ThrowTypeError("Second argument should be a Number");
	}

	int rows = (int)(info[0]->Int32Value());
	int columns = (int)(info[1]->Int32Value());
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::resize_lp(obj->lp, rows, columns);
	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::rows) {
	if (info.Length() != 0) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	int ret = ::get_Nrows(obj->lp);
	info.GetReturnValue().Set(Nan::New<Number>(ret));
}

NAN_METHOD(LPSolve::columns) {
	if (info.Length() != 0) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	int ret = ::get_Ncolumns(obj->lp);
	info.GetReturnValue().Set(Nan::New<Number>(ret));
}

NAN_METHOD(LPSolve::rh) {
    if (info.Length() == 0 || info.Length() > 2) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
        return Nan::ThrowTypeError("First argument should be a Number");
    }

    if (info.Length() == 1) {
        int rownr = (int)(info[0]->Int32Value());
        	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        	REAL ret = ::get_rh(obj->lp, rownr);
        	info.GetReturnValue().Set(Nan::New<Number>(ret));
    } else {
        if (!(info[1]->IsNumber())) {
            return Nan::ThrowTypeError("Second argument should be a Number");
        }

        int rownr = (int)(info[0]->Int32Value());
        REAL value = (REAL)(info[1]->NumberValue());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::set_rh(obj->lp, rownr, value);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
    }
}

NAN_METHOD(LPSolve::rhRange) {
	if (info.Length() == 0 || info.Length() > 2) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
        return Nan::ThrowTypeError("First argument should be a Number");
    }

	if (info.Length() == 1) {
	    int rownr = (int)(info[0]->Int32Value());
    	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    	REAL ret = ::get_rh_range(obj->lp, rownr);
    	info.GetReturnValue().Set(Nan::New<Number>(ret));
	} else {
	    if (!(info[1]->IsNumber())) {
    	    return Nan::ThrowTypeError("Second argument should be a Number");
    	}

    	int rownr = (int)(info[0]->Int32Value());
    	REAL deltavalue = (REAL)(info[1]->NumberValue());
    	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    	MYBOOL ret = ::set_rh_range(obj->lp, rownr, deltavalue);
    	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	}
}

NAN_METHOD(LPSolve::rhVec) {
	if (info.Length() != 1) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsArray() || info[0]->IsNull())) {
	    return Nan::ThrowTypeError("First argument should be a Array of Numbers or NULL");
	}

	REAL* rh;
	if (info[0]->IsArray()) {
		Handle<Array> rh_handle = Handle<Array>::Cast(info[0]);
		int rh_n = rh_handle->Length();
		rh = new REAL[rh_n];
		for (int i = 0; i < rh_n; i++) {
			rh[i] = rh_handle->Get(i)->NumberValue();
		}
	}

	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	::set_rh_vec(obj->lp, rh);

	if (info[0]->IsArray()) {
		delete rh;
	}
}

NAN_METHOD(LPSolve::rhVecStr) {
	if (info.Length() != 1) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsString())) {
	    return Nan::ThrowTypeError("First argument should be a String");
	}

	String::Utf8Value str_rh_string(info[0]);
	char* rh_string = *str_rh_string;
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::str_set_rh_vec(obj->lp, rh_string);
	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::constraint) {
	if (info.Length() != 3) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsArray() || info[0]->IsNull())) {
	    return Nan::ThrowTypeError("First argument should be a Array of Numbers or NULL");
	}

	if (!(info[1]->IsNumber())) {
	    return Nan::ThrowTypeError("Second argument should be a Number");
	}

	if (!(info[2]->IsNumber())) {
	    return Nan::ThrowTypeError("Third argument should be a Number");
	}

	REAL* row;
	if (info[0]->IsArray()) {
		Handle<Array> row_handle = Handle<Array>::Cast(info[0]);
		int row_n = row_handle->Length();
		row = new REAL[row_n];
		for (int i = 0; i < row_n; i++) {
		    row[i] = row_handle->Get(i)->NumberValue();
		}
	}

	int constr_type = (int)(info[1]->Int32Value());
	REAL rh = (REAL)(info[2]->NumberValue());
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::add_constraint(obj->lp, row, constr_type, rh);
	if (info[0]->IsArray()) {
		delete row;
	}

	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::constraintEx) {
	if (info.Length() != 5) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("First argument should be a Number");
	}

	if (!(info[1]->IsArray() || info[1]->IsNull())) {
	    return Nan::ThrowTypeError("Second argument should be a Array of Numbers or NULL");
	}

	if (!(info[2]->IsArray() || info[2]->IsNull())) {
	    return Nan::ThrowTypeError("Third argument should be a Array of Numbers or NULL");
	}

	if (!(info[3]->IsNumber())) {
	    return Nan::ThrowTypeError("Fourth argument should be a Number");
	}

	if (!(info[4]->IsNumber())) {
	    return Nan::ThrowTypeError("Fifth argument should be a Number");
	}

	int count = (int)(info[0]->Int32Value());
	REAL* row;
	if (info[1]->IsArray()) {
		Handle<Array> row_handle = Handle<Array>::Cast(info[1]);
		int row_n = row_handle->Length();
		row = new REAL[row_n];
		for (int i = 0; i < row_n; i++) {
			row[i] = row_handle->Get(i)->NumberValue();
		}
	}

	int* colno;
	if (info[2]->IsArray()) {
		Handle<Array> colno_handle = Handle<Array>::Cast(info[2]);
		int colno_n = colno_handle->Length();
		colno = new int[colno_n];
		for (int i = 0; i < colno_n; i++)
			colno[i] = colno_handle->Get(i)->Int32Value();
	}

	int constr_type = (int)(info[3]->Int32Value());
	REAL rh = (REAL)(info[4]->NumberValue());
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::add_constraintex(obj->lp, count, row, colno, constr_type, rh);

	if (info[1]->IsArray()) {
		delete row;
	}

	if (info[2]->IsArray()) {
		delete colno;
	}

	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::constraintStr) {
	if (info.Length() != 3) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsString())) {
	    return Nan::ThrowTypeError("First argument should be a String");
	}

	if (!(info[1]->IsNumber())) {
	    return Nan::ThrowTypeError("Second argument should be a Number");
	}

	if (!(info[2]->IsNumber())) {
	    return Nan::ThrowTypeError("Third argument should be a Number");
	}

	String::Utf8Value str_row_string(info[0]);
	char* row_string = *str_row_string;
	int constr_type = (int)(info[1]->Int32Value());
	REAL rh = (REAL)(info[2]->NumberValue());
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::str_add_constraint(obj->lp, row_string, constr_type, rh);
	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::upBound) {
    if (info.Length() == 0 || info.Length() > 2) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("First argument should be a Number");
	}

	if (info.Length() == 1) {
	    int colnr = (int)(info[0]->Int32Value());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        REAL ret = ::get_upbo(obj->lp, colnr);
        info.GetReturnValue().Set(Nan::New<Number>(ret));
	} else {
	    if (!(info[1]->IsNumber())) {
    	    return Nan::ThrowTypeError("First argument should be a Number");
    	}

    	int colnr = (int)(info[0]->Int32Value());
        REAL value = (REAL)(info[1]->NumberValue());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::set_upbo(obj->lp, colnr, value);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	}
}

NAN_METHOD(LPSolve::lowBound) {
    if (info.Length() == 0 || info.Length() > 2) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("First argument should be a Number");
	}

	if (info.Length() == 1) {
	    int colnr = (int)(info[0]->Int32Value());
    	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    	REAL ret = ::get_lowbo(obj->lp, colnr);
    	info.GetReturnValue().Set(Nan::New<Number>(ret));
	} else {
	    if (!(info[1]->IsNumber())) {
    	    return Nan::ThrowTypeError("First argument should be a Number");
    	}

    	int colnr = (int)(info[0]->Int32Value());
        REAL value = (REAL)(info[1]->NumberValue());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::set_lowbo(obj->lp, colnr, value);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	}
}

NAN_METHOD(LPSolve::bounds) {
	if (info.Length() != 3) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsNumber())) {
	    return Nan::ThrowTypeError("First argument should be a Number");
	}
	
	if (!(info[1]->IsNumber())) {
	    return Nan::ThrowTypeError("Second argument should be a Number");
	}
	
	if (!(info[2]->IsNumber())) {
	    return Nan::ThrowTypeError("Third argument should be a Number");
	}
	
	int colnr = (int)(info[0]->Int32Value());
	REAL lower = (REAL)(info[1]->NumberValue());
	REAL upper = (REAL)(info[2]->NumberValue());
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::set_bounds(obj->lp, colnr, lower, upper);
	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::breakAtFirst) {
    if (info.Length() > 1) {
       return Nan::ThrowError("Invalid number of arguments");
    }

	if (info.Length() == 0) {
	    LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        MYBOOL ret = ::is_break_at_first(obj->lp);
        info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
	} else {
	    if (!(info[0]->IsBoolean())) {
    	    return Nan::ThrowTypeError("First argument should be a Boolean");
    	}

	    MYBOOL break_at_first = (MYBOOL)(info[0]->BooleanValue());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        ::set_break_at_first(obj->lp, break_at_first);
	}
}

NAN_METHOD(LPSolve::verbose) {
	if (info.Length() > 1) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (info.Length() == 0) {
	    LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    	int ret = ::get_verbose(obj->lp);
    	info.GetReturnValue().Set(Nan::New<Number>(ret));
	} else {
	    if (!(info[0]->IsNumber())) {
    	    return Nan::ThrowTypeError("First argument should be a Number");
    	}

    	int verbose = (int)(info[0]->Int32Value());
    	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    	::set_verbose(obj->lp, verbose);
	}
}

NAN_METHOD(LPSolve::timeout) {
	if (info.Length() > 1) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (info.Length() == 0) {
	    LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        long ret = ::get_timeout(obj->lp);
        info.GetReturnValue().Set(Nan::New<Number>(ret));
	} else {
	    if (!(info[0]->IsNumber())) {
    	    return Nan::ThrowTypeError("First argument should be a Number");
    	}

    	long sectimeout = (long)(info[0]->IntegerValue());
        LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
        ::set_timeout(obj->lp, sectimeout);
	}
}

NAN_METHOD(LPSolve::writeLP) {
	if (info.Length() != 1) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsString())) {
	    return Nan::ThrowTypeError("First argument should be a String");
	}

	String::Utf8Value str_output(info[0]);
	FILE *output = fopen(*str_output, "w");
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	MYBOOL ret = ::write_LP(obj->lp, output);
	fclose(output);
	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::solve) {
    LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
  	Nan::Callback *callback = new Nan::Callback(info[0].As<Function>());
	Nan::AsyncQueueWorker(new LPSolveWorker(callback, obj->lp));
}

NAN_METHOD(LPSolve::solveSync) {
	if (info.Length() != 0) {
	    return Nan::ThrowError("Invalid number of arguments");
	}

	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	int ret = ::solve(obj->lp);
	info.GetReturnValue().Set(Nan::New<Number>(ret));
}

NAN_METHOD(LPSolve::variables) {
	if (info.Length() != 1){
	    return Nan::ThrowError("Invalid number of arguments");
	}

	if (!(info[0]->IsArray())) {
	    return Nan::ThrowTypeError("First argument should be a Array of Numbers");
	}

	Handle<Array> var_handle = Handle<Array>::Cast(info[0]);
	LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
	int var_n = ::get_Ncolumns(obj->lp);
	REAL* var = new REAL[var_n];
	MYBOOL ret = ::get_variables(obj->lp, var);
	for (int i = 0; i < var_n; i++) {
		var_handle->Set(i, Nan::New<Number>(var[i]));
	}

	delete var;
	info.GetReturnValue().Set(Nan::New<Boolean>(ret == 1));
}

NAN_METHOD(LPSolve::deleteLP) {
    if (info.Length() != 0) {
        return Nan::ThrowError("Invalid number of arguments");
    }

    LPSolve* obj = node::ObjectWrap::Unwrap<LPSolve>(info.This());
    ::free_lp(&obj->lp);
    ::delete_lp(obj->lp);
}