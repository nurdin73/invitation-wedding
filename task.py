#!/usr/bin/env python3
"""
Entry point for multi-agent execution in invitation-wedding.
Executes the sequential 5-agent pipeline:
  Leader -> Planner -> [Approval Gate] -> Executor -> Tester (Unit & E2E) -> Reviewer -> Leader Sign-off
"""

from runner import run_pipeline, main


def run_all(command_input: str, auto_approve: bool = False) -> None:
    """
    Programmatic entry point to run the sequential multi-agent feature pipeline.
    """
    run_pipeline(command_input, auto_approve=auto_approve)


if __name__ == "__main__":
    main()