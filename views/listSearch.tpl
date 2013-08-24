%if len(cases) > 0:

    <h2>Search Results</h2>
    <div class="row">
    <table class="span10 offset1 table table-hover table-bordered">
        <thead>
            <th>Medical Record Number</th>
            <th>Case Title</th>
            <th>Case Findings</th>
        </thead>
        %for case in cases: 
            <tr onclick="window.location.href = '/showcase/{{case.case_id}}';">
                <td>{{case.mrn}}</td>
                <td>{{case.case_title}}</td>
                <td>{{case.findings}}</td>
            </tr>
        %end
    </table>
    </div>

%else:
	<h2>No cases found</h2>
%end

%rebase base title='List cases searched', session=session, cases=cases, message=message