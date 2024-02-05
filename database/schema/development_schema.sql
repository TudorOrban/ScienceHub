--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: development; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA development;


--
-- Name: SCHEMA development; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA development IS 'standard development schema';


--
-- Name: chat_types; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.chat_types AS ENUM (
    'Private chat',
    'Group chat'
);


--
-- Name: TYPE chat_types; Type: COMMENT; Schema: development; Owner: -
--

COMMENT ON TYPE development.chat_types IS 'Types of chat rooms';


--
-- Name: issue_status; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.issue_status AS ENUM (
    'Opened',
    'Closed'
);


--
-- Name: TYPE issue_status; Type: COMMENT; Schema: development; Owner: -
--

COMMENT ON TYPE development.issue_status IS 'The possible status types of a project/work issue';


--
-- Name: pricing_plan_interval; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.pricing_plan_interval AS ENUM (
    'day',
    'week',
    'month',
    'year'
);


--
-- Name: pricing_type; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.pricing_type AS ENUM (
    'one_time',
    'recurring'
);


--
-- Name: review_status; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.review_status AS ENUM (
    'In progress',
    'Submitted'
);


--
-- Name: TYPE review_status; Type: COMMENT; Schema: development; Owner: -
--

COMMENT ON TYPE development.review_status IS 'The possible status types of a project/work review';


--
-- Name: review_type; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.review_type AS ENUM (
    'Community Review',
    'Blind Review'
);


--
-- Name: TYPE review_type; Type: COMMENT; Schema: development; Owner: -
--

COMMENT ON TYPE development.review_type IS 'The possible types of a project/work review';


--
-- Name: role; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.role AS ENUM (
    'Main Author',
    'Contributor'
);


--
-- Name: TYPE role; Type: COMMENT; Schema: development; Owner: -
--

COMMENT ON TYPE development.role IS 'Roles of users with respect to project/work';


--
-- Name: submission_status; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.submission_status AS ENUM (
    'In progress',
    'Submitted',
    'Accepted'
);


--
-- Name: TYPE submission_status; Type: COMMENT; Schema: development; Owner: -
--

COMMENT ON TYPE development.submission_status IS 'The possible status types of a project/work submission';


--
-- Name: subscription_status; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.subscription_status AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid'
);


--
-- Name: work_type; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.work_type AS ENUM (
    'Paper',
    'Experiment',
    'Dataset',
    'Data Analysis',
    'AI Model',
    'Code Block'
);


--
-- Name: TYPE work_type; Type: COMMENT; Schema: development; Owner: -
--

COMMENT ON TYPE development.work_type IS 'The types of works in ScienceHub (using labels)';


--
-- Name: work_submissions_in_bulk_result; Type: TYPE; Schema: development; Owner: -
--

CREATE TYPE development.work_submissions_in_bulk_result AS (
	id bigint,
	work_id bigint,
	work_type development.work_type,
	initial_work_version_id bigint,
	final_work_version_id bigint,
	status development.submission_status,
	title text,
	description text,
	development boolean,
	work_delta jsonb,
	file_changes jsonb,
	submitted_data jsonb,
	accepted_data jsonb
);


--
-- Name: fetch_work_submissions(integer[]); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.fetch_work_submissions(version_pairs integer[]) RETURNS SETOF development.work_submissions_in_bulk_result
    LANGUAGE plpgsql
    AS $$
DECLARE
    version_pair int[];
    result_row work_submissions_in_bulk_result; -- Declare a variable of your custom type
BEGIN
    FOREACH version_pair SLICE 1 IN ARRAY version_pairs LOOP
        -- For each pair, execute the query and store the result
        FOR result_row IN
            SELECT 
                ws.id, 
                ws.work_id, 
                ws.work_type, 
                ws.initial_work_version_id, 
                ws.final_work_version_id, 
                ws.status,
                ws.title,
                ws.description,
                ws.development,
                ws.work_delta,
                ws.file_changes, 
                ws.submitted_data, 
                ws.accepted_data
            FROM work_submissions ws
            WHERE ws.initial_work_version_id = version_pair[1]
            AND ws.final_work_version_id = version_pair[2]
        LOOP
            RETURN NEXT result_row; -- Return each row
        END LOOP;
    END LOOP;
    RETURN; -- Final return at the end of the function
END;
$$;


--
-- Name: fetch_work_submissions(bigint[]); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.fetch_work_submissions(version_pairs bigint[]) RETURNS SETOF development.work_submissions_in_bulk_result
    LANGUAGE plpgsql
    AS $$
DECLARE
    i int;
BEGIN
    FOR i IN 1..array_upper(version_pairs, 1) - 1 BY 2 LOOP
        RETURN QUERY SELECT 
            ws.id, 
            ws.work_id, 
            ws.work_type, 
            ws.initial_work_version_id, 
            ws.final_work_version_id, 
            ws.status,
            ws.title,
            ws.description,
            ws.development,
            ws.work_delta,
            ws.file_changes, 
            ws.submitted_data, 
            ws.accepted_data
        FROM work_submissions ws
        WHERE ws.initial_work_version_id = version_pairs[i]
        AND ws.final_work_version_id = version_pairs[i + 1];
    END LOOP;
    RETURN; 
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  begin
    insert into development.users (id, full_name, avatar_url)
    values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    return new;
  end;
$$;


--
-- Name: new_fetch_work_submissions(bigint[]); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.new_fetch_work_submissions(version_pairs bigint[]) RETURNS SETOF development.work_submissions_in_bulk_result
    LANGUAGE plpgsql
    AS $$
DECLARE
    i int;
    query text := ''; -- Initialize an empty query string
BEGIN
    FOR i IN 1..array_upper(version_pairs, 1) - 1 BY 2 LOOP
        -- Append each SELECT statement to the query string with UNION ALL
        query := query || format('SELECT ws.id, ws.work_id, ws.work_type, ws.initial_work_version_id, ws.final_work_version_id, ws.status, ws.title, ws.description, ws.development, ws.work_delta, ws.file_changes, ws.submitted_data, ws.accepted_data FROM work_submissions ws WHERE ws.initial_work_version_id = %s AND ws.final_work_version_id = %s', version_pairs[i], version_pairs[i + 1]);
        IF i < array_upper(version_pairs, 1) - 1 THEN
            query := query || ' UNION ALL '; -- Add UNION ALL except for the last iteration
        END IF;
    END LOOP;

    -- Execute the dynamically built query
    RETURN QUERY EXECUTE query;
END;
$$;


--
-- Name: update_children_comments_count_function(); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.update_children_comments_count_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.parent_comment_id IS NOT NULL THEN
    UPDATE discussion_comments
    SET children_comments_count = children_comments_count + 1
    WHERE id = NEW.parent_comment_id;
  END IF;

  RETURN NEW;
END
$$;


--
-- Name: update_citations_count(); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.update_citations_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    CASE
        WHEN NEW.target_work_type = 'Paper' THEN
            UPDATE papers SET citations_count = citations_count + 1 WHERE id = NEW.target_work_id;
        WHEN NEW.target_work_type = 'Experiment' THEN
            UPDATE experiments SET citations_count = citations_count + 1 WHERE id = NEW.target_work_id;
        WHEN NEW.target_work_type = 'Dataset' THEN
            UPDATE datasets SET citations_count = citations_count + 1 WHERE id = NEW.target_work_id;
        WHEN NEW.target_work_type = 'Data Analysis' THEN
            UPDATE data_analyses SET citations_count = citations_count + 1 WHERE id = NEW.target_work_id;
        WHEN NEW.target_work_type = 'AI Model' THEN
            UPDATE ai_models SET citations_count = citations_count + 1 WHERE id = NEW.target_work_id;
        WHEN NEW.target_work_type = 'Code Block' THEN
            UPDATE code_blocks SET citations_count = citations_count + 1 WHERE id = NEW.target_work_id;
    END CASE;
    RETURN NEW;
END;
$$;


--
-- Name: update_project_delta_partial(integer, jsonb); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.update_project_delta_partial(submission_id integer, delta_changes jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    key text;
    value jsonb;
    current_project_delta jsonb; -- Declare the variable to store the current project_delta
BEGIN
    -- Retrieve the current project_delta
    SELECT COALESCE(project_delta, '{}'::jsonb) INTO current_project_delta FROM project_submissions WHERE id = submission_id;

    -- Iterate over each key-value pair in delta_changes and update the project_delta JSONB column
    FOR key, value IN SELECT * FROM jsonb_each(delta_changes)
    LOOP
        current_project_delta = jsonb_set(
            current_project_delta, 
            ARRAY[key], 
            value, 
            true
        );
    END LOOP;

    -- Update the project_delta field in the project_submissions table
    UPDATE project_submissions
    SET project_delta = current_project_delta
    WHERE id = submission_id;
END;
$$;


--
-- Name: update_work_delta_field(integer, text[], jsonb); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.update_work_delta_field(submission_id integer, field_path text[], new_value jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE work_submissions
    SET work_delta = jsonb_set(
        COALESCE(work_delta, '{}'::jsonb), -- Ensure work_delta is not null
        field_path, 
        new_value, 
        true
    )
    WHERE id = submission_id;
END;
$$;


--
-- Name: update_work_delta_fields(integer, text[], jsonb[]); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.update_work_delta_fields(submission_id integer, keys text[], new_values jsonb[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    i integer;
    new_work_delta jsonb;
BEGIN
    -- Retrieve the current work_delta
    SELECT COALESCE(work_delta, '{}'::jsonb) INTO new_work_delta FROM work_submissions WHERE id = submission_id;

    -- Apply updates for each key
    FOR i IN 1 .. array_length(keys, 1) LOOP
        new_work_delta = jsonb_set(
            new_work_delta, 
            ARRAY[keys[i]], 
            new_values[i], 
            true
        );
    END LOOP;

    -- Update the work_delta field in the table
    UPDATE work_submissions
    SET work_delta = new_work_delta
    WHERE id = submission_id;
END;
$$;


--
-- Name: update_work_delta_partial(integer, jsonb); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.update_work_delta_partial(submission_id integer, delta_changes jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    key text;
    value jsonb;
    current_work_delta jsonb; -- Declare the variable to store the current work_delta
BEGIN
    -- Retrieve the current work_delta
    SELECT COALESCE(work_delta, '{}'::jsonb) INTO current_work_delta FROM work_submissions WHERE id = submission_id;

    -- Iterate over each key-value pair in delta_changes and update the work_delta JSONB column
    FOR key, value IN SELECT * FROM jsonb_each(delta_changes)
    LOOP
        current_work_delta = jsonb_set(
            current_work_delta, 
            ARRAY[key], 
            value, 
            true
        );
    END LOOP;

    -- Update the work_delta field in the work_submissions table
    UPDATE work_submissions
    SET work_delta = current_work_delta
    WHERE id = submission_id;
END;
$$;


--
-- Name: update_work_deltas(integer, text[], jsonb[]); Type: FUNCTION; Schema: development; Owner: -
--

CREATE FUNCTION development.update_work_deltas(submission_id integer, field_paths text[], new_values jsonb[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    i integer;
    new_work_delta jsonb;
BEGIN
    -- Initialize new_work_delta with the current work_delta or an empty JSONB object
    SELECT COALESCE(work_delta, '{}'::jsonb) INTO new_work_delta FROM work_submissions WHERE id = submission_id;

    -- Apply each update in turn
    FOR i IN 1 .. array_length(field_paths, 1) LOOP
        new_work_delta = jsonb_set(
            new_work_delta, 
            field_paths[i], 
            new_values[i], 
            true
        );
    END LOOP;

    -- Update the work_delta field in the table with the new JSONB object
    UPDATE work_submissions
    SET work_delta = new_work_delta
    WHERE id = submission_id;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_models; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.ai_models (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    description text,
    code_path text,
    model_type text,
    model_path text,
    development boolean,
    folder_id bigint,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    work_type text DEFAULT 'AI Model'::text,
    current_work_version_id bigint,
    work_metadata jsonb DEFAULT '{}'::jsonb,
    file_location jsonb DEFAULT '{}'::jsonb,
    submitted boolean DEFAULT false,
    link text,
    research_score integer DEFAULT 0,
    h_index integer DEFAULT 0,
    citations_count bigint DEFAULT '0'::bigint
);


--
-- Name: AI_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.ai_models ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development."AI_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ai_model_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.ai_model_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    ai_model_id bigint NOT NULL,
    role development.role,
    team_id uuid NOT NULL
);


--
-- Name: ai_model_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.ai_model_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    ai_model_id bigint NOT NULL,
    role development.role
);


--
-- Name: bookmarks; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.bookmarks (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    object_type text,
    object_id bigint,
    bookmark_data json,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text)
);


--
-- Name: bookmarks_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.bookmarks ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.bookmarks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chat_messages; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.chat_messages (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    chat_id bigint NOT NULL,
    user_id uuid NOT NULL,
    content text,
    updated_at timestamp with time zone,
    seen boolean DEFAULT false
);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.chat_messages ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.chat_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: chat_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.chat_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    chat_id bigint NOT NULL,
    team_id uuid NOT NULL
);


--
-- Name: chat_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.chat_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    chat_id bigint NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: chats; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.chats (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    type development.chat_types,
    title text,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    link text
);


--
-- Name: citations; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.citations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    source_object_id text,
    source_object_type text,
    target_object_id text,
    target_object_type text,
    updated_at timestamp with time zone
);


--
-- Name: citations_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.citations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.citations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: code_block_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.code_block_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    code_block_id bigint NOT NULL,
    role development.role
);


--
-- Name: code_block_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.code_block_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    code_block_id bigint NOT NULL,
    role text
);


--
-- Name: code_blocks; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.code_blocks (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    description text,
    code_path text,
    folder_id integer,
    development boolean,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    current_work_version_id bigint,
    work_metadata jsonb DEFAULT '{}'::jsonb,
    file_location jsonb DEFAULT '{}'::jsonb,
    submitted boolean DEFAULT false,
    link text,
    research_score integer DEFAULT 0,
    h_index integer DEFAULT 0,
    citations_count bigint DEFAULT '0'::bigint,
    work_type development.work_type DEFAULT 'Code Block'::development.work_type
);


--
-- Name: code_blocks_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.code_blocks ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.code_blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: comment_upvotes; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.comment_upvotes (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    comment_id integer NOT NULL
);


--
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.chats ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: data_analyses; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.data_analyses (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    description text,
    development boolean,
    folder_id integer,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    work_type text DEFAULT 'Data Analysis'::text,
    current_work_version_id bigint,
    work_metadata jsonb DEFAULT '{}'::jsonb,
    file_location jsonb DEFAULT '{}'::jsonb,
    submitted boolean DEFAULT false,
    link text,
    research_score integer DEFAULT 0,
    h_index integer DEFAULT 0,
    citations_count integer DEFAULT 0
);


--
-- Name: data_analysis_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.data_analysis_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    data_analysis_id bigint NOT NULL,
    role text,
    team_id uuid NOT NULL
);


--
-- Name: data_analysis_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.data_analysis_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    data_analysis_id bigint NOT NULL,
    role text
);


--
-- Name: dataanalysis_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.data_analyses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.dataanalysis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: dataset_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.dataset_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    dataset_id bigint NOT NULL,
    role text,
    team_id uuid NOT NULL
);


--
-- Name: dataset_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.dataset_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    dataset_id bigint NOT NULL,
    role text
);


--
-- Name: datasets; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.datasets (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    description text,
    development boolean,
    folder_id integer,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    work_type text DEFAULT 'Dataset'::text,
    current_work_version_id bigint,
    dataset_location json,
    notes text[],
    work_metadata json,
    file_location json,
    submitted boolean DEFAULT false,
    link text,
    research_score integer DEFAULT 0,
    h_index integer DEFAULT 0,
    citations_count bigint DEFAULT '0'::bigint
);


--
-- Name: datasets_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.datasets ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.datasets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: discussion_comments; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.discussion_comments (
    id integer NOT NULL,
    discussion_id integer,
    user_id uuid,
    content text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    parent_comment_id integer,
    children_comments_count integer DEFAULT 0,
    link text
);


--
-- Name: discussion_comments_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.discussion_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discussion_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.discussion_comments_id_seq OWNED BY development.discussion_comments.id;


--
-- Name: discussion_upvotes; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.discussion_upvotes (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    discussion_id bigint NOT NULL
);


--
-- Name: discussions; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.discussions (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    user_id uuid,
    content text,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    link text
);


--
-- Name: discussions_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.discussions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.discussions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: experiment_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.experiment_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    experiment_id bigint NOT NULL,
    role text,
    team_id uuid NOT NULL
);


--
-- Name: experiment_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.experiment_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    experiment_id bigint NOT NULL,
    role text
);


--
-- Name: experiments; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.experiments (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    description text,
    methodology jsonb,
    status text,
    conclusion text,
    experiment_path text,
    folder_id integer,
    development boolean,
    objective text,
    hypothesis text,
    pdf_path text,
    supplementary_material text,
    license text,
    research_grants text[],
    updated_at timestamp with time zone DEFAULT now(),
    work_type text DEFAULT 'Experiment'::text,
    current_work_version_id bigint,
    work_metadata jsonb DEFAULT '{}'::jsonb,
    file_location jsonb DEFAULT '{}'::jsonb,
    submitted boolean DEFAULT false,
    link text,
    research_score integer DEFAULT 0,
    h_index integer DEFAULT 0,
    citations_count bigint DEFAULT '0'::bigint
);


--
-- Name: experiments_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.experiments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.experiments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: feedback_responses; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.feedback_responses (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    feedback_id bigint,
    content text,
    user_id uuid,
    development boolean
);


--
-- Name: feedback_responses_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.feedback_responses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.feedback_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: feedbacks; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.feedbacks (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    content text,
    development boolean,
    tags jsonb[],
    title text,
    description text,
    link text
);


--
-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.feedbacks ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.feedbacks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: field_of_research_relationships; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.field_of_research_relationships (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_field_id bigint NOT NULL,
    child_field_id bigint NOT NULL,
    relationship_type text
);


--
-- Name: fields_of_research; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.fields_of_research (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text
);


--
-- Name: fields_of_research_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.fields_of_research ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.fields_of_research_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: files; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.files (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    type text,
    content text,
    updated_at timestamp with time zone DEFAULT now(),
    project_id bigint
);


--
-- Name: files_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.files ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: folders; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.folders (
    id integer NOT NULL,
    parent_id integer,
    project_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: folders_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

CREATE SEQUENCE development.folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: folders_id_seq; Type: SEQUENCE OWNED BY; Schema: development; Owner: -
--

ALTER SEQUENCE development.folders_id_seq OWNED BY development.folders.id;


--
-- Name: follows; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.follows (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    follower_id uuid NOT NULL,
    followed_id uuid NOT NULL
);


--
-- Name: links; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.links (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    source_object_id text,
    source_object_type text,
    target_object_id text,
    target_object_type text,
    relationship_type text,
    updated_at timestamp with time zone
);


--
-- Name: object_relationships_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.links ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.object_relationships_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: paper_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.paper_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    paper_id bigint NOT NULL,
    role text,
    team_id uuid NOT NULL
);


--
-- Name: paper_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.paper_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    paper_id bigint NOT NULL,
    role text
);


--
-- Name: papers; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.papers (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    description text,
    folder_id integer,
    development boolean,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    work_type text DEFAULT 'Paper'::text,
    current_work_version_id bigint,
    work_metadata jsonb DEFAULT '{}'::jsonb,
    abstract text,
    file_location jsonb,
    submitted boolean DEFAULT false,
    link text,
    research_score integer DEFAULT 0,
    h_index integer DEFAULT 0,
    citations_count bigint DEFAULT '0'::bigint
);


--
-- Name: papers_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.papers ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.papers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: plan_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.plan_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    plan_id bigint NOT NULL
);


--
-- Name: plans; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.plans (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    starting_at_date timestamp with time zone,
    ending_at_date timestamp with time zone,
    title text,
    description text,
    linked_objects json,
    tags text[],
    development boolean,
    updated_at timestamp with time zone,
    color text
);


--
-- Name: plans_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.plans ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_ai_models; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_ai_models (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    ai_model_id bigint NOT NULL
);


--
-- Name: project_code_blocks; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_code_blocks (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    code_block_id bigint NOT NULL
);


--
-- Name: project_data_analyses; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_data_analyses (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    data_analysis_id bigint NOT NULL
);


--
-- Name: project_datasets; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_datasets (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    dataset_id bigint NOT NULL
);


--
-- Name: project_deltas; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_deltas (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    initial_project_version_id bigint,
    final_project_version_id bigint,
    delta_data json,
    updated_at timestamp with time zone
);


--
-- Name: project_deltas_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.project_deltas ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.project_deltas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_experiments; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_experiments (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    experiment_id bigint NOT NULL
);


--
-- Name: project_fields_of_research; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_fields_of_research (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    field_of_research_id bigint NOT NULL
);


--
-- Name: project_issue_responses; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_issue_responses (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    content text,
    project_issue_id bigint
);


--
-- Name: project_issue_responses_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.project_issue_responses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.project_issue_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_issue_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_issue_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    project_issue_id bigint NOT NULL
);


--
-- Name: project_issue_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_issue_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    project_issue_id bigint NOT NULL
);


--
-- Name: project_issues; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_issues (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint,
    status development.issue_status,
    title text,
    description text,
    development boolean,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    link text
);


--
-- Name: project_issues_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.project_issues ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.project_issues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_papers; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_papers (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    paper_id bigint NOT NULL
);


--
-- Name: project_review_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_review_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    project_review_id bigint NOT NULL
);


--
-- Name: project_review_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_review_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    project_review_id bigint NOT NULL
);


--
-- Name: project_reviews; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_reviews (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint,
    review_type development.review_type DEFAULT 'Community Review'::development.review_type,
    status development.review_status DEFAULT 'In progress'::development.review_status,
    title text,
    description text,
    content text,
    development boolean,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    link text
);


--
-- Name: project_reviews_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.project_reviews ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.project_reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_shares; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_shares (
    created_at timestamp with time zone,
    project_id bigint NOT NULL,
    sharing_user_id uuid NOT NULL
);


--
-- Name: project_snapshots; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_snapshots (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint,
    project_version_id bigint,
    snapshot_data json,
    updated_at timestamp with time zone
);


--
-- Name: project_snapshots_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.project_snapshots ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.project_snapshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_submission_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_submission_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    project_submission_id bigint,
    role text
);


--
-- Name: project_submission_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_submission_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    project_submission_id bigint NOT NULL
);


--
-- Name: project_submissions; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_submissions (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint,
    initial_project_version_id bigint,
    final_project_version_id bigint,
    status development.submission_status DEFAULT 'In progress'::development.submission_status,
    title text,
    description text,
    development boolean,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    project_delta jsonb DEFAULT '{}'::jsonb,
    submitted_data jsonb DEFAULT '{}'::jsonb,
    accepted_data jsonb DEFAULT '{}'::jsonb,
    link text
);


--
-- Name: project_submissions_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.project_submissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.project_submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    role text,
    team_id uuid NOT NULL
);


--
-- Name: project_upvotes; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_upvotes (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    upvoting_user_id uuid NOT NULL
);


--
-- Name: project_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_users (
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    role text
);


--
-- Name: project_version_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_version_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    project_version_id bigint NOT NULL,
    role text
);


--
-- Name: project_version_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_version_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_version_id bigint NOT NULL,
    role text,
    user_id uuid NOT NULL
);


--
-- Name: project_versions; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_versions (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    version_number bigint,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    description text,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    works json,
    version_tag text
);


--
-- Name: project_versions_graphs; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_versions_graphs (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint,
    graph_data jsonb,
    title text,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    version_edges jsonb DEFAULT '[]'::jsonb
);


--
-- Name: project_versions_graphs_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.project_versions_graphs ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.project_versions_graphs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_versions_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.project_versions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.project_versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_views; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_views (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id bigint NOT NULL,
    viewing_user_id uuid NOT NULL
);


--
-- Name: project_work_submissions; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.project_work_submissions (
    project_submission_id bigint NOT NULL,
    work_submission_id bigint NOT NULL
);


--
-- Name: projects; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.projects (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text,
    description text,
    development boolean,
    image_path text,
    stars integer,
    research_score bigint,
    h_index integer,
    total_project_citations_count bigint,
    total_citations_count bigint,
    name text,
    current_project_version_id bigint,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    project_metadata jsonb DEFAULT '{}'::jsonb,
    link text
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.projects ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: team_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.team_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    role text,
    team_id uuid NOT NULL
);


--
-- Name: teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.teams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_name text,
    description text,
    development boolean,
    team_username text,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    link text
);


--
-- Name: user_settings; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.user_settings (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    research_highlights json,
    pinned_pages json,
    header_off boolean,
    editor_settings json
);


--
-- Name: user_status; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.user_status (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    is_online boolean,
    last_seen timestamp with time zone
);


--
-- Name: user_status_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.user_status ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.user_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.users (
    id uuid NOT NULL,
    full_name text NOT NULL,
    avatar_url text,
    billing_address jsonb,
    payment_method jsonb,
    username text NOT NULL,
    email text,
    first_name text,
    last_name text,
    bio text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    number_of_projects bigint,
    number_of_works bigint,
    number_of_submissions bigint,
    research_score double precision,
    h_index bigint,
    total_citations bigint,
    total_upvotes bigint,
    reviews_count bigint,
    is_verified boolean,
    qualifications text,
    affiliations text,
    research_interests text,
    roles text,
    education text,
    contact_information text,
    occupations text,
    location text,
    fields_of_research text,
    positions json,
    external_accounts json,
    status text
);


--
-- Name: work_citations; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_citations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    source_work_id bigint,
    source_work_type development.work_type,
    target_work_id bigint,
    target_work_type development.work_type
);


--
-- Name: work_ctations_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_citations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_ctations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_deltas; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_deltas (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    work_version_id_from bigint,
    work_version_id_to bigint,
    delta_data json,
    updated_at timestamp with time zone,
    work_type text
);


--
-- Name: work_deltas_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_deltas ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_deltas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_fields_of_research; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_fields_of_research (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    field_of_research_id bigint,
    work_id bigint,
    work_type text
);


--
-- Name: work_issue_responses; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_issue_responses (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    content text,
    work_issue_id bigint
);


--
-- Name: work_issue_responses_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_issue_responses ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_issue_responses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_issue_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_issue_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    work_issue_id bigint NOT NULL
);


--
-- Name: work_issue_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_issue_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    work_issue_id bigint NOT NULL
);


--
-- Name: work_issues; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_issues (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    work_id bigint,
    work_type development.work_type,
    status development.issue_status,
    title text,
    description text,
    development boolean,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    project_id bigint,
    link text
);


--
-- Name: work_issues_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_issues ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_issues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_review_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_review_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    work_review_id bigint NOT NULL
);


--
-- Name: work_review_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_review_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    work_review_id bigint NOT NULL
);


--
-- Name: work_reviews; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_reviews (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    review_type development.review_type DEFAULT 'Community Review'::development.review_type,
    work_id bigint,
    work_type development.work_type,
    status development.review_status DEFAULT 'In progress'::development.review_status,
    title text,
    description text,
    development boolean,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    project_id bigint,
    content text,
    link text
);


--
-- Name: work_reviews_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_reviews ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_snapshots; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_snapshots (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    work_id bigint,
    work_type development.work_type,
    snapshot_data json,
    work_version_id bigint
);


--
-- Name: work_snapshots_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_snapshots ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_snapshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_submission_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_submission_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    work_submission_id bigint NOT NULL
);


--
-- Name: work_submission_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_submission_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    work_submission_id bigint NOT NULL,
    role text
);


--
-- Name: work_submissions; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_submissions (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    work_type development.work_type,
    work_id bigint,
    initial_work_version_id bigint,
    final_work_version_id bigint,
    status development.submission_status DEFAULT 'In progress'::development.submission_status,
    title text,
    development boolean DEFAULT false,
    description text,
    project_id bigint,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    work_delta jsonb DEFAULT '{}'::json,
    submitted_data jsonb DEFAULT '{}'::jsonb,
    accepted_data jsonb DEFAULT '{}'::jsonb,
    file_changes jsonb DEFAULT '{}'::jsonb,
    link text
);


--
-- Name: work_submissions_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_submissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_version_teams; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_version_teams (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    team_id uuid NOT NULL,
    work_version_id bigint NOT NULL,
    role text
);


--
-- Name: work_version_users; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_version_users (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    work_version_id bigint NOT NULL,
    role text
);


--
-- Name: work_versions; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_versions (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    work_type development.work_type,
    work_id bigint,
    version_number bigint,
    description text,
    development boolean,
    updated_at timestamp with time zone
);


--
-- Name: work_versions_graphs; Type: TABLE; Schema: development; Owner: -
--

CREATE TABLE development.work_versions_graphs (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    work_id bigint,
    work_type development.work_type,
    graph_data json,
    version_edges jsonb DEFAULT '[]'::jsonb
);


--
-- Name: work_versions_graphs_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_versions_graphs ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_versions_graphs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: work_versions_id_seq; Type: SEQUENCE; Schema: development; Owner: -
--

ALTER TABLE development.work_versions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME development.work_versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: discussion_comments id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussion_comments ALTER COLUMN id SET DEFAULT nextval('development.discussion_comments_id_seq'::regclass);


--
-- Name: folders id; Type: DEFAULT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.folders ALTER COLUMN id SET DEFAULT nextval('development.folders_id_seq'::regclass);


--
-- Name: ai_models AI_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_models
    ADD CONSTRAINT "AI_pkey" PRIMARY KEY (id);


--
-- Name: ai_model_teams ai_model_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_model_teams
    ADD CONSTRAINT ai_model_teams_pkey PRIMARY KEY (ai_model_id, team_id);


--
-- Name: ai_model_users ai_model_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_model_users
    ADD CONSTRAINT ai_model_users_pkey PRIMARY KEY (user_id, ai_model_id);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: chat_teams chat_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_teams
    ADD CONSTRAINT chat_teams_pkey PRIMARY KEY (chat_id, team_id);


--
-- Name: chat_users chat_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_users
    ADD CONSTRAINT chat_users_pkey PRIMARY KEY (chat_id, user_id);


--
-- Name: citations citations_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.citations
    ADD CONSTRAINT citations_pkey PRIMARY KEY (id);


--
-- Name: code_block_users code_block_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_block_users
    ADD CONSTRAINT code_block_users_pkey PRIMARY KEY (user_id, code_block_id);


--
-- Name: code_blocks code_blocks_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_blocks
    ADD CONSTRAINT code_blocks_pkey PRIMARY KEY (id);


--
-- Name: code_block_teams code_blocks_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_block_teams
    ADD CONSTRAINT code_blocks_teams_pkey PRIMARY KEY (team_id, code_block_id);


--
-- Name: comment_upvotes comment_upvotes_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.comment_upvotes
    ADD CONSTRAINT comment_upvotes_pkey PRIMARY KEY (user_id, comment_id);


--
-- Name: chats conversations_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chats
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: data_analysis_teams data_analysis_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analysis_teams
    ADD CONSTRAINT data_analysis_teams_pkey PRIMARY KEY (data_analysis_id, team_id);


--
-- Name: data_analysis_users data_analysis_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analysis_users
    ADD CONSTRAINT data_analysis_users_pkey PRIMARY KEY (user_id, data_analysis_id);


--
-- Name: data_analyses dataanalysis_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analyses
    ADD CONSTRAINT dataanalysis_pkey PRIMARY KEY (id);


--
-- Name: dataset_teams dataset_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.dataset_teams
    ADD CONSTRAINT dataset_teams_pkey PRIMARY KEY (dataset_id, team_id);


--
-- Name: dataset_users dataset_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.dataset_users
    ADD CONSTRAINT dataset_users_pkey PRIMARY KEY (user_id, dataset_id);


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: discussion_comments discussion_comments_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussion_comments
    ADD CONSTRAINT discussion_comments_pkey PRIMARY KEY (id);


--
-- Name: discussion_upvotes discussion_upvotes_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussion_upvotes
    ADD CONSTRAINT discussion_upvotes_pkey PRIMARY KEY (user_id, discussion_id);


--
-- Name: discussions discussions_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussions
    ADD CONSTRAINT discussions_pkey PRIMARY KEY (id);


--
-- Name: experiment_teams experiment_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiment_teams
    ADD CONSTRAINT experiment_teams_pkey PRIMARY KEY (experiment_id, team_id);


--
-- Name: experiment_users experiment_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiment_users
    ADD CONSTRAINT experiment_users_pkey PRIMARY KEY (user_id, experiment_id);


--
-- Name: experiments experiments_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiments
    ADD CONSTRAINT experiments_pkey PRIMARY KEY (id);


--
-- Name: feedback_responses feedback_responses_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.feedback_responses
    ADD CONSTRAINT feedback_responses_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: field_of_research_relationships field_of_research_relationships_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.field_of_research_relationships
    ADD CONSTRAINT field_of_research_relationships_pkey PRIMARY KEY (parent_field_id, child_field_id);


--
-- Name: fields_of_research fields_of_research_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.fields_of_research
    ADD CONSTRAINT fields_of_research_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: folders folders_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.folders
    ADD CONSTRAINT folders_pkey PRIMARY KEY (id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (follower_id, followed_id);


--
-- Name: links object_relationships_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.links
    ADD CONSTRAINT object_relationships_pkey PRIMARY KEY (id);


--
-- Name: paper_teams paper_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.paper_teams
    ADD CONSTRAINT paper_teams_pkey PRIMARY KEY (paper_id, team_id);


--
-- Name: paper_users paper_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.paper_users
    ADD CONSTRAINT paper_users_pkey PRIMARY KEY (user_id, paper_id);


--
-- Name: papers papers_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.papers
    ADD CONSTRAINT papers_pkey PRIMARY KEY (id);


--
-- Name: plan_users plan_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.plan_users
    ADD CONSTRAINT plan_users_pkey PRIMARY KEY (user_id, plan_id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: project_ai_models project_ai_models_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_ai_models
    ADD CONSTRAINT project_ai_models_pkey PRIMARY KEY (project_id, ai_model_id);


--
-- Name: project_code_blocks project_code_blocks_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_code_blocks
    ADD CONSTRAINT project_code_blocks_pkey PRIMARY KEY (project_id, code_block_id);


--
-- Name: project_data_analyses project_data_analyses_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_data_analyses
    ADD CONSTRAINT project_data_analyses_pkey PRIMARY KEY (project_id, data_analysis_id);


--
-- Name: project_datasets project_datasets_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_datasets
    ADD CONSTRAINT project_datasets_pkey PRIMARY KEY (project_id, dataset_id);


--
-- Name: project_deltas project_deltas_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_deltas
    ADD CONSTRAINT project_deltas_pkey PRIMARY KEY (id);


--
-- Name: project_experiments project_experiments_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_experiments
    ADD CONSTRAINT project_experiments_pkey PRIMARY KEY (project_id, experiment_id);


--
-- Name: project_fields_of_research project_fields_of_research_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_fields_of_research
    ADD CONSTRAINT project_fields_of_research_pkey PRIMARY KEY (project_id, field_of_research_id);


--
-- Name: project_issue_responses project_issue_responses_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_responses
    ADD CONSTRAINT project_issue_responses_pkey PRIMARY KEY (id);


--
-- Name: project_issue_teams project_issue_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_teams
    ADD CONSTRAINT project_issue_teams_pkey PRIMARY KEY (team_id, project_issue_id);


--
-- Name: project_issue_users project_issue_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_users
    ADD CONSTRAINT project_issue_users_pkey PRIMARY KEY (user_id, project_issue_id);


--
-- Name: project_issues project_issues_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issues
    ADD CONSTRAINT project_issues_pkey PRIMARY KEY (id);


--
-- Name: project_papers project_papers_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_papers
    ADD CONSTRAINT project_papers_pkey PRIMARY KEY (project_id, paper_id);


--
-- Name: project_review_teams project_review_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_review_teams
    ADD CONSTRAINT project_review_teams_pkey PRIMARY KEY (team_id, project_review_id);


--
-- Name: project_review_users project_review_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_review_users
    ADD CONSTRAINT project_review_users_pkey PRIMARY KEY (user_id, project_review_id);


--
-- Name: project_reviews project_reviews_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_reviews
    ADD CONSTRAINT project_reviews_pkey PRIMARY KEY (id);


--
-- Name: project_shares project_shares_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_shares
    ADD CONSTRAINT project_shares_pkey PRIMARY KEY (project_id, sharing_user_id);


--
-- Name: project_snapshots project_snapshots_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_snapshots
    ADD CONSTRAINT project_snapshots_pkey PRIMARY KEY (id);


--
-- Name: project_submission_teams project_submission_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submission_teams
    ADD CONSTRAINT project_submission_teams_pkey PRIMARY KEY (team_id);


--
-- Name: project_submission_users project_submission_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submission_users
    ADD CONSTRAINT project_submission_users_pkey PRIMARY KEY (user_id, project_submission_id);


--
-- Name: project_submissions project_submissions_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submissions
    ADD CONSTRAINT project_submissions_pkey PRIMARY KEY (id);


--
-- Name: project_teams project_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_teams
    ADD CONSTRAINT project_teams_pkey PRIMARY KEY (project_id, team_id);


--
-- Name: project_upvotes project_upvotes_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_upvotes
    ADD CONSTRAINT project_upvotes_pkey PRIMARY KEY (project_id, upvoting_user_id);


--
-- Name: project_users project_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_users
    ADD CONSTRAINT project_users_pkey PRIMARY KEY (user_id, project_id);


--
-- Name: project_version_teams project_version_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_version_teams
    ADD CONSTRAINT project_version_teams_pkey PRIMARY KEY (team_id, project_version_id);


--
-- Name: project_version_users project_version_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_version_users
    ADD CONSTRAINT project_version_users_pkey PRIMARY KEY (project_version_id, user_id);


--
-- Name: project_versions_graphs project_versions_graphs_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_versions_graphs
    ADD CONSTRAINT project_versions_graphs_pkey PRIMARY KEY (id);


--
-- Name: project_versions project_versions_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_versions
    ADD CONSTRAINT project_versions_pkey PRIMARY KEY (id);


--
-- Name: project_views project_views_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_views
    ADD CONSTRAINT project_views_pkey PRIMARY KEY (project_id, viewing_user_id);


--
-- Name: project_work_submissions project_work_submissions_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_work_submissions
    ADD CONSTRAINT project_work_submissions_pkey PRIMARY KEY (project_submission_id, work_submission_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: team_users team_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.team_users
    ADD CONSTRAINT team_users_pkey PRIMARY KEY (user_id, team_id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (user_id);


--
-- Name: user_status user_status_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.user_status
    ADD CONSTRAINT user_status_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: work_citations work_ctations_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_citations
    ADD CONSTRAINT work_ctations_pkey PRIMARY KEY (id);


--
-- Name: work_deltas work_deltas_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_deltas
    ADD CONSTRAINT work_deltas_pkey PRIMARY KEY (id);


--
-- Name: work_issue_users work_issue_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_users
    ADD CONSTRAINT work_issue_pkey PRIMARY KEY (user_id, work_issue_id);


--
-- Name: work_issue_responses work_issue_responses_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_responses
    ADD CONSTRAINT work_issue_responses_pkey PRIMARY KEY (id);


--
-- Name: work_issue_teams work_issue_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_teams
    ADD CONSTRAINT work_issue_teams_pkey PRIMARY KEY (team_id, work_issue_id);


--
-- Name: work_issues work_issues_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issues
    ADD CONSTRAINT work_issues_pkey PRIMARY KEY (id);


--
-- Name: work_review_users work_review_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_review_users
    ADD CONSTRAINT work_review_pkey PRIMARY KEY (user_id, work_review_id);


--
-- Name: work_review_teams work_review_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_review_teams
    ADD CONSTRAINT work_review_teams_pkey PRIMARY KEY (team_id, work_review_id);


--
-- Name: work_reviews work_reviews_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_reviews
    ADD CONSTRAINT work_reviews_pkey PRIMARY KEY (id);


--
-- Name: work_snapshots work_snapshots_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_snapshots
    ADD CONSTRAINT work_snapshots_pkey PRIMARY KEY (id);


--
-- Name: work_submission_teams work_submission_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submission_teams
    ADD CONSTRAINT work_submission_teams_pkey PRIMARY KEY (team_id, work_submission_id);


--
-- Name: work_submission_users work_submission_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submission_users
    ADD CONSTRAINT work_submission_users_pkey PRIMARY KEY (user_id, work_submission_id);


--
-- Name: work_submissions work_submissions_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submissions
    ADD CONSTRAINT work_submissions_pkey PRIMARY KEY (id);


--
-- Name: work_version_teams work_version_teams_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_version_teams
    ADD CONSTRAINT work_version_teams_pkey PRIMARY KEY (team_id, work_version_id);


--
-- Name: work_version_users work_version_users_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_version_users
    ADD CONSTRAINT work_version_users_pkey PRIMARY KEY (user_id, work_version_id);


--
-- Name: work_versions_graphs work_versions_graphs_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_versions_graphs
    ADD CONSTRAINT work_versions_graphs_pkey PRIMARY KEY (id);


--
-- Name: work_versions work_versions_pkey; Type: CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_versions
    ADD CONSTRAINT work_versions_pkey PRIMARY KEY (id);


--
-- Name: idx_project_users_composite; Type: INDEX; Schema: development; Owner: -
--

CREATE INDEX idx_project_users_composite ON development.project_users USING btree (user_id, project_id);


--
-- Name: discussion_comments update_children_comments_count; Type: TRIGGER; Schema: development; Owner: -
--

CREATE TRIGGER update_children_comments_count AFTER INSERT ON development.discussion_comments FOR EACH ROW EXECUTE FUNCTION development.update_children_comments_count_function();


--
-- Name: work_citations updatecitationscount; Type: TRIGGER; Schema: development; Owner: -
--

CREATE TRIGGER updatecitationscount AFTER INSERT ON development.work_citations FOR EACH ROW EXECUTE FUNCTION development.update_citations_count();


--
-- Name: ai_model_teams ai_model_teams_ai_model_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_model_teams
    ADD CONSTRAINT ai_model_teams_ai_model_id_fkey FOREIGN KEY (ai_model_id) REFERENCES development.ai_models(id) ON DELETE CASCADE;


--
-- Name: ai_model_teams ai_model_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_model_teams
    ADD CONSTRAINT ai_model_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: ai_model_users ai_model_users_ai_model_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_model_users
    ADD CONSTRAINT ai_model_users_ai_model_id_fkey FOREIGN KEY (ai_model_id) REFERENCES development.ai_models(id) ON DELETE CASCADE;


--
-- Name: ai_model_users ai_model_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_model_users
    ADD CONSTRAINT ai_model_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: ai_models ai_models_current_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_models
    ADD CONSTRAINT ai_models_current_work_version_id_fkey FOREIGN KEY (current_work_version_id) REFERENCES development.work_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ai_models ai_models_folder_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.ai_models
    ADD CONSTRAINT ai_models_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES development.ai_models(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_chat_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_messages
    ADD CONSTRAINT chat_messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES development.chats(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: chat_teams chat_teams_chat_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_teams
    ADD CONSTRAINT chat_teams_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES development.chats(id) ON DELETE CASCADE;


--
-- Name: chat_teams chat_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_teams
    ADD CONSTRAINT chat_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id);


--
-- Name: chat_users chat_users_chat_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_users
    ADD CONSTRAINT chat_users_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES development.chats(id) ON DELETE CASCADE;


--
-- Name: chat_users chat_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.chat_users
    ADD CONSTRAINT chat_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: code_block_teams code_block_teams_code_block_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_block_teams
    ADD CONSTRAINT code_block_teams_code_block_id_fkey FOREIGN KEY (code_block_id) REFERENCES development.code_blocks(id) ON DELETE CASCADE;


--
-- Name: code_block_teams code_block_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_block_teams
    ADD CONSTRAINT code_block_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: code_block_users code_block_users_code_block_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_block_users
    ADD CONSTRAINT code_block_users_code_block_id_fkey FOREIGN KEY (code_block_id) REFERENCES development.code_blocks(id) ON DELETE CASCADE;


--
-- Name: code_block_users code_block_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_block_users
    ADD CONSTRAINT code_block_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: code_blocks code_blocks_current_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_blocks
    ADD CONSTRAINT code_blocks_current_work_version_id_fkey FOREIGN KEY (current_work_version_id) REFERENCES development.work_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: code_blocks code_blocks_folder_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.code_blocks
    ADD CONSTRAINT code_blocks_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES development.folders(id) ON DELETE CASCADE;


--
-- Name: comment_upvotes comment_upvotes_comment_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.comment_upvotes
    ADD CONSTRAINT comment_upvotes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES development.discussion_comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comment_upvotes comment_upvotes_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.comment_upvotes
    ADD CONSTRAINT comment_upvotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: data_analyses data_analyses_current_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analyses
    ADD CONSTRAINT data_analyses_current_work_version_id_fkey FOREIGN KEY (current_work_version_id) REFERENCES development.work_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: data_analyses data_analyses_folder_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analyses
    ADD CONSTRAINT data_analyses_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES development.folders(id) ON DELETE CASCADE;


--
-- Name: data_analysis_teams data_analysis_teams_data_analysis_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analysis_teams
    ADD CONSTRAINT data_analysis_teams_data_analysis_id_fkey FOREIGN KEY (data_analysis_id) REFERENCES development.data_analyses(id) ON DELETE CASCADE;


--
-- Name: data_analysis_teams data_analysis_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analysis_teams
    ADD CONSTRAINT data_analysis_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: data_analysis_users data_analysis_users_data_analysis_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analysis_users
    ADD CONSTRAINT data_analysis_users_data_analysis_id_fkey FOREIGN KEY (data_analysis_id) REFERENCES development.data_analyses(id) ON DELETE CASCADE;


--
-- Name: data_analysis_users data_analysis_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.data_analysis_users
    ADD CONSTRAINT data_analysis_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: dataset_teams dataset_teams_dataset_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.dataset_teams
    ADD CONSTRAINT dataset_teams_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES development.datasets(id) ON DELETE CASCADE;


--
-- Name: dataset_teams dataset_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.dataset_teams
    ADD CONSTRAINT dataset_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: dataset_users dataset_users_dataset_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.dataset_users
    ADD CONSTRAINT dataset_users_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES development.datasets(id) ON DELETE CASCADE;


--
-- Name: dataset_users dataset_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.dataset_users
    ADD CONSTRAINT dataset_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: datasets datasets_current_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.datasets
    ADD CONSTRAINT datasets_current_work_version_id_fkey FOREIGN KEY (current_work_version_id) REFERENCES development.work_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: datasets datasets_folder_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.datasets
    ADD CONSTRAINT datasets_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES development.folders(id) ON DELETE CASCADE;


--
-- Name: discussion_comments discussion_comments_discussion_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussion_comments
    ADD CONSTRAINT discussion_comments_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES development.discussions(id);


--
-- Name: discussion_comments discussion_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussion_comments
    ADD CONSTRAINT discussion_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES development.discussion_comments(id);


--
-- Name: discussion_comments discussion_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussion_comments
    ADD CONSTRAINT discussion_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id);


--
-- Name: discussion_upvotes discussion_upvotes_discussion_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussion_upvotes
    ADD CONSTRAINT discussion_upvotes_discussion_id_fkey FOREIGN KEY (discussion_id) REFERENCES development.discussions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: discussion_upvotes discussion_upvotes_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussion_upvotes
    ADD CONSTRAINT discussion_upvotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: discussions discussions_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.discussions
    ADD CONSTRAINT discussions_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: experiment_teams experiment_teams_experiment_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiment_teams
    ADD CONSTRAINT experiment_teams_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES development.experiments(id) ON DELETE CASCADE;


--
-- Name: experiment_teams experiment_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiment_teams
    ADD CONSTRAINT experiment_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: experiment_users experiment_users_experiment_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiment_users
    ADD CONSTRAINT experiment_users_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES development.experiments(id) ON DELETE CASCADE;


--
-- Name: experiment_users experiment_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiment_users
    ADD CONSTRAINT experiment_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: experiments experiments_current_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiments
    ADD CONSTRAINT experiments_current_work_version_id_fkey FOREIGN KEY (current_work_version_id) REFERENCES development.work_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: experiments experiments_folder_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.experiments
    ADD CONSTRAINT experiments_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES development.folders(id) ON DELETE CASCADE;


--
-- Name: feedback_responses feedback_responses_feedback_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.feedback_responses
    ADD CONSTRAINT feedback_responses_feedback_id_fkey FOREIGN KEY (feedback_id) REFERENCES development.feedbacks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: feedback_responses feedback_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.feedback_responses
    ADD CONSTRAINT feedback_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: feedbacks feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.feedbacks
    ADD CONSTRAINT feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: field_of_research_relationships field_of_research_relationships_child_field_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.field_of_research_relationships
    ADD CONSTRAINT field_of_research_relationships_child_field_id_fkey FOREIGN KEY (child_field_id) REFERENCES development.fields_of_research(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: field_of_research_relationships field_of_research_relationships_parent_field_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.field_of_research_relationships
    ADD CONSTRAINT field_of_research_relationships_parent_field_id_fkey FOREIGN KEY (parent_field_id) REFERENCES development.fields_of_research(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files files_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.files
    ADD CONSTRAINT files_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: folders folders_parent_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.folders
    ADD CONSTRAINT folders_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES development.folders(id);


--
-- Name: folders folders_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.folders
    ADD CONSTRAINT folders_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: follows follows_followed_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.follows
    ADD CONSTRAINT follows_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: paper_teams paper_teams_paper_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.paper_teams
    ADD CONSTRAINT paper_teams_paper_id_fkey FOREIGN KEY (paper_id) REFERENCES development.papers(id) ON DELETE CASCADE;


--
-- Name: paper_teams paper_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.paper_teams
    ADD CONSTRAINT paper_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: paper_users paper_users_paper_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.paper_users
    ADD CONSTRAINT paper_users_paper_id_fkey FOREIGN KEY (paper_id) REFERENCES development.papers(id) ON DELETE CASCADE;


--
-- Name: paper_users paper_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.paper_users
    ADD CONSTRAINT paper_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: papers papers_current_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.papers
    ADD CONSTRAINT papers_current_work_version_id_fkey FOREIGN KEY (current_work_version_id) REFERENCES development.work_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: papers papers_folder_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.papers
    ADD CONSTRAINT papers_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES development.folders(id) ON DELETE CASCADE;


--
-- Name: plan_users plan_users_plan_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.plan_users
    ADD CONSTRAINT plan_users_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES development.plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: plan_users plan_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.plan_users
    ADD CONSTRAINT plan_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_ai_models project_ai_models_ai_model_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_ai_models
    ADD CONSTRAINT project_ai_models_ai_model_id_fkey FOREIGN KEY (ai_model_id) REFERENCES development.ai_models(id) ON DELETE CASCADE;


--
-- Name: project_ai_models project_ai_models_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_ai_models
    ADD CONSTRAINT project_ai_models_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_code_blocks project_code_blocks_code_block_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_code_blocks
    ADD CONSTRAINT project_code_blocks_code_block_id_fkey FOREIGN KEY (code_block_id) REFERENCES development.code_blocks(id) ON DELETE CASCADE;


--
-- Name: project_code_blocks project_code_blocks_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_code_blocks
    ADD CONSTRAINT project_code_blocks_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_data_analyses project_data_analyses_data_analysis_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_data_analyses
    ADD CONSTRAINT project_data_analyses_data_analysis_id_fkey FOREIGN KEY (data_analysis_id) REFERENCES development.data_analyses(id) ON DELETE CASCADE;


--
-- Name: project_data_analyses project_data_analyses_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_data_analyses
    ADD CONSTRAINT project_data_analyses_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_datasets project_datasets_dataset_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_datasets
    ADD CONSTRAINT project_datasets_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES development.datasets(id) ON DELETE CASCADE;


--
-- Name: project_datasets project_datasets_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_datasets
    ADD CONSTRAINT project_datasets_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_deltas project_deltas_final_project_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_deltas
    ADD CONSTRAINT project_deltas_final_project_version_id_fkey FOREIGN KEY (final_project_version_id) REFERENCES development.project_versions(id) ON DELETE CASCADE;


--
-- Name: project_deltas project_deltas_initial_project_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_deltas
    ADD CONSTRAINT project_deltas_initial_project_version_id_fkey FOREIGN KEY (initial_project_version_id) REFERENCES development.project_versions(id) ON DELETE CASCADE;


--
-- Name: project_experiments project_experiments_experiment_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_experiments
    ADD CONSTRAINT project_experiments_experiment_id_fkey FOREIGN KEY (experiment_id) REFERENCES development.experiments(id) ON DELETE CASCADE;


--
-- Name: project_experiments project_experiments_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_experiments
    ADD CONSTRAINT project_experiments_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_fields_of_research project_fields_of_research_field_of_research_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_fields_of_research
    ADD CONSTRAINT project_fields_of_research_field_of_research_id_fkey FOREIGN KEY (field_of_research_id) REFERENCES development.fields_of_research(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_fields_of_research project_fields_of_research_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_fields_of_research
    ADD CONSTRAINT project_fields_of_research_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_issue_responses project_issue_responses_project_issue_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_responses
    ADD CONSTRAINT project_issue_responses_project_issue_id_fkey FOREIGN KEY (project_issue_id) REFERENCES development.project_issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_issue_responses project_issue_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_responses
    ADD CONSTRAINT project_issue_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_issue_teams project_issue_teams_project_issue_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_teams
    ADD CONSTRAINT project_issue_teams_project_issue_id_fkey FOREIGN KEY (project_issue_id) REFERENCES development.project_issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_issue_teams project_issue_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_teams
    ADD CONSTRAINT project_issue_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_issue_users project_issue_users_project_issue_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_users
    ADD CONSTRAINT project_issue_users_project_issue_id_fkey FOREIGN KEY (project_issue_id) REFERENCES development.project_issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_issue_users project_issue_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issue_users
    ADD CONSTRAINT project_issue_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_issues project_issues_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_issues
    ADD CONSTRAINT project_issues_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_papers project_papers_paper_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_papers
    ADD CONSTRAINT project_papers_paper_id_fkey FOREIGN KEY (paper_id) REFERENCES development.papers(id) ON DELETE CASCADE;


--
-- Name: project_papers project_papers_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_papers
    ADD CONSTRAINT project_papers_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_review_teams project_review_teams_project_review_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_review_teams
    ADD CONSTRAINT project_review_teams_project_review_id_fkey FOREIGN KEY (project_review_id) REFERENCES development.project_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_review_teams project_review_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_review_teams
    ADD CONSTRAINT project_review_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_review_users project_review_users_project_review_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_review_users
    ADD CONSTRAINT project_review_users_project_review_id_fkey FOREIGN KEY (project_review_id) REFERENCES development.project_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_review_users project_review_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_review_users
    ADD CONSTRAINT project_review_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_reviews project_reviews_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_reviews
    ADD CONSTRAINT project_reviews_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_shares project_shares_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_shares
    ADD CONSTRAINT project_shares_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_shares project_shares_sharing_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_shares
    ADD CONSTRAINT project_shares_sharing_user_id_fkey FOREIGN KEY (sharing_user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_snapshots project_snapshots_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_snapshots
    ADD CONSTRAINT project_snapshots_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_snapshots project_snapshots_project_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_snapshots
    ADD CONSTRAINT project_snapshots_project_version_id_fkey FOREIGN KEY (project_version_id) REFERENCES development.project_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_submission_teams project_submission_teams_project_submission_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submission_teams
    ADD CONSTRAINT project_submission_teams_project_submission_id_fkey FOREIGN KEY (project_submission_id) REFERENCES development.project_submissions(id) ON DELETE CASCADE;


--
-- Name: project_submission_teams project_submission_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submission_teams
    ADD CONSTRAINT project_submission_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: project_submission_users project_submission_users_project_submission_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submission_users
    ADD CONSTRAINT project_submission_users_project_submission_id_fkey FOREIGN KEY (project_submission_id) REFERENCES development.project_submissions(id) ON DELETE CASCADE;


--
-- Name: project_submission_users project_submission_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submission_users
    ADD CONSTRAINT project_submission_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: project_submissions project_submissions_final_project_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submissions
    ADD CONSTRAINT project_submissions_final_project_version_id_fkey FOREIGN KEY (final_project_version_id) REFERENCES development.project_versions(id) ON DELETE CASCADE;


--
-- Name: project_submissions project_submissions_initial_project_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submissions
    ADD CONSTRAINT project_submissions_initial_project_version_id_fkey FOREIGN KEY (initial_project_version_id) REFERENCES development.project_versions(id) ON DELETE CASCADE;


--
-- Name: project_submissions project_submissions_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_submissions
    ADD CONSTRAINT project_submissions_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_teams project_teams_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_teams
    ADD CONSTRAINT project_teams_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_teams project_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_teams
    ADD CONSTRAINT project_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: project_upvotes project_upvotes_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_upvotes
    ADD CONSTRAINT project_upvotes_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_upvotes project_upvotes_upvoting_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_upvotes
    ADD CONSTRAINT project_upvotes_upvoting_user_id_fkey FOREIGN KEY (upvoting_user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_users project_users_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_users
    ADD CONSTRAINT project_users_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_users project_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_users
    ADD CONSTRAINT project_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: project_version_teams project_version_teams_project_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_version_teams
    ADD CONSTRAINT project_version_teams_project_version_id_fkey FOREIGN KEY (project_version_id) REFERENCES development.project_versions(id) ON DELETE CASCADE;


--
-- Name: project_version_teams project_version_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_version_teams
    ADD CONSTRAINT project_version_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: project_version_users project_version_users_project_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_version_users
    ADD CONSTRAINT project_version_users_project_version_id_fkey FOREIGN KEY (project_version_id) REFERENCES development.project_versions(id) ON DELETE CASCADE;


--
-- Name: project_version_users project_version_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_version_users
    ADD CONSTRAINT project_version_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: project_versions_graphs project_versions_graphs_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_versions_graphs
    ADD CONSTRAINT project_versions_graphs_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_versions project_versions_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_versions
    ADD CONSTRAINT project_versions_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON DELETE CASCADE;


--
-- Name: project_views project_views_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_views
    ADD CONSTRAINT project_views_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_views project_views_viewing_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_views
    ADD CONSTRAINT project_views_viewing_user_id_fkey FOREIGN KEY (viewing_user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_work_submissions project_work_submissions_project_submission_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_work_submissions
    ADD CONSTRAINT project_work_submissions_project_submission_id_fkey FOREIGN KEY (project_submission_id) REFERENCES development.project_submissions(id);


--
-- Name: project_work_submissions project_work_submissions_work_submission_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.project_work_submissions
    ADD CONSTRAINT project_work_submissions_work_submission_id_fkey FOREIGN KEY (work_submission_id) REFERENCES development.work_submissions(id);


--
-- Name: projects projects_current_project_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.projects
    ADD CONSTRAINT projects_current_project_version_id_fkey FOREIGN KEY (current_project_version_id) REFERENCES development.project_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_users team_users_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.team_users
    ADD CONSTRAINT team_users_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: team_users team_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.team_users
    ADD CONSTRAINT team_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: user_settings user_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_status user_status_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.user_status
    ADD CONSTRAINT user_status_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.users
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);


--
-- Name: work_deltas work_deltas_work_version_id_from_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_deltas
    ADD CONSTRAINT work_deltas_work_version_id_from_fkey FOREIGN KEY (work_version_id_from) REFERENCES development.work_versions(id) ON DELETE CASCADE;


--
-- Name: work_deltas work_deltas_work_version_id_to_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_deltas
    ADD CONSTRAINT work_deltas_work_version_id_to_fkey FOREIGN KEY (work_version_id_to) REFERENCES development.work_versions(id) ON DELETE CASCADE;


--
-- Name: work_fields_of_research work_fields_of_research_field_of_research_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_fields_of_research
    ADD CONSTRAINT work_fields_of_research_field_of_research_id_fkey FOREIGN KEY (field_of_research_id) REFERENCES development.fields_of_research(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_issue_responses work_issue_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_responses
    ADD CONSTRAINT work_issue_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_issue_responses work_issue_responses_work_issue_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_responses
    ADD CONSTRAINT work_issue_responses_work_issue_id_fkey FOREIGN KEY (work_issue_id) REFERENCES development.work_issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_issue_teams work_issue_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_teams
    ADD CONSTRAINT work_issue_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_issue_teams work_issue_teams_work_issue_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_teams
    ADD CONSTRAINT work_issue_teams_work_issue_id_fkey FOREIGN KEY (work_issue_id) REFERENCES development.work_issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_issue_users work_issue_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_users
    ADD CONSTRAINT work_issue_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_issue_users work_issue_users_work_issue_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issue_users
    ADD CONSTRAINT work_issue_users_work_issue_id_fkey FOREIGN KEY (work_issue_id) REFERENCES development.work_issues(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_issues work_issues_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_issues
    ADD CONSTRAINT work_issues_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_review_teams work_review_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_review_teams
    ADD CONSTRAINT work_review_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_review_teams work_review_teams_work_review_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_review_teams
    ADD CONSTRAINT work_review_teams_work_review_id_fkey FOREIGN KEY (work_review_id) REFERENCES development.work_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_review_users work_review_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_review_users
    ADD CONSTRAINT work_review_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_review_users work_review_users_work_review_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_review_users
    ADD CONSTRAINT work_review_users_work_review_id_fkey FOREIGN KEY (work_review_id) REFERENCES development.work_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_reviews work_reviews_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_reviews
    ADD CONSTRAINT work_reviews_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_snapshots work_snapshots_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_snapshots
    ADD CONSTRAINT work_snapshots_work_version_id_fkey FOREIGN KEY (work_version_id) REFERENCES development.work_versions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_submission_teams work_submission_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submission_teams
    ADD CONSTRAINT work_submission_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: work_submission_teams work_submission_teams_work_submission_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submission_teams
    ADD CONSTRAINT work_submission_teams_work_submission_id_fkey FOREIGN KEY (work_submission_id) REFERENCES development.work_submissions(id) ON DELETE CASCADE;


--
-- Name: work_submission_users work_submission_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submission_users
    ADD CONSTRAINT work_submission_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: work_submission_users work_submission_users_work_submission_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submission_users
    ADD CONSTRAINT work_submission_users_work_submission_id_fkey FOREIGN KEY (work_submission_id) REFERENCES development.work_submissions(id) ON DELETE CASCADE;


--
-- Name: work_submissions work_submissions_final_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submissions
    ADD CONSTRAINT work_submissions_final_work_version_id_fkey FOREIGN KEY (final_work_version_id) REFERENCES development.work_versions(id) ON DELETE CASCADE;


--
-- Name: work_submissions work_submissions_initial_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submissions
    ADD CONSTRAINT work_submissions_initial_work_version_id_fkey FOREIGN KEY (initial_work_version_id) REFERENCES development.work_versions(id) ON DELETE CASCADE;


--
-- Name: work_submissions work_submissions_project_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_submissions
    ADD CONSTRAINT work_submissions_project_id_fkey FOREIGN KEY (project_id) REFERENCES development.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_version_teams work_version_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_version_teams
    ADD CONSTRAINT work_version_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES development.teams(id) ON DELETE CASCADE;


--
-- Name: work_version_teams work_version_teams_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_version_teams
    ADD CONSTRAINT work_version_teams_work_version_id_fkey FOREIGN KEY (work_version_id) REFERENCES development.work_versions(id) ON DELETE CASCADE;


--
-- Name: work_version_users work_version_users_user_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_version_users
    ADD CONSTRAINT work_version_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES development.users(id) ON DELETE CASCADE;


--
-- Name: work_version_users work_version_users_work_version_id_fkey; Type: FK CONSTRAINT; Schema: development; Owner: -
--

ALTER TABLE ONLY development.work_version_users
    ADD CONSTRAINT work_version_users_work_version_id_fkey FOREIGN KEY (work_version_id) REFERENCES development.work_versions(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

