#!/usr/bin/env python3
"""
Multi-Agent Feature Runner for invitation-wedding.
Orchestrates 5 specialized agents:
  1. Leader: Evaluates necessity, YAGNI, and defines project scope.
  2. Planner: Creates architectural plan and testing blueprint.
  [Semi-Autonomous Approval Gate]
  3. Executor: Implements feature code changes and builds.
  4. Tester: Authors and runs Unit Tests (*.test.ts) & E2E Integration Tests.
  5. Reviewer: Audits code, tests, and architecture against repository rules.
"""

from __future__ import annotations

import argparse
import datetime
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Optional, Tuple


# Terminal styling helpers
class Colors:
    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    RESET = "\033[0m"


def print_banner(text: str) -> None:
    print(f"\n{Colors.BOLD}{Colors.HEADER}{'=' * 70}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.HEADER}  {text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.HEADER}{'=' * 70}{Colors.RESET}\n")


def print_step(agent_name: str, message: str) -> None:
    badge = f"[{agent_name.upper()}]"
    print(f"\n{Colors.BOLD}{Colors.CYAN}{badge} {message}{Colors.RESET}\n")


def print_success(message: str) -> None:
    print(f"{Colors.BOLD}{Colors.GREEN}[✓] {message}{Colors.RESET}")


def print_warning(message: str) -> None:
    print(f"{Colors.BOLD}{Colors.YELLOW}[!] {message}{Colors.RESET}")


def print_error(message: str) -> None:
    print(f"{Colors.BOLD}{Colors.RED}[✗] {message}{Colors.RESET}")


def get_agy_executable() -> str:
    exe = shutil.which("agy")
    if not exe:
        # Fallback to standard AppData installation on Windows
        local_app_data = os.environ.get("LOCALAPPDATA", "")
        fallback = Path(local_app_data) / "agy" / "bin" / "agy.exe"
        if fallback.is_file():
            return str(fallback)
        raise FileNotFoundError(
            "Executable 'agy' tidak ditemukan di PATH maupun %LOCALAPPDATA%\\agy\\bin\\agy.exe."
        )
    return exe


def invoke_agent(
    agent_name: str,
    prompt: str,
    model: str = "gemini-3.8-flash-medium",
    allow_edits: bool = False,
    timeout_seconds: int = 360,
) -> str:
    """Invokes a specific subagent through the Antigravity CLI."""
    agy_exe = get_agy_executable()
    cmd = [
        agy_exe,
        "--agent",
        agent_name,
        "--model",
        model,
    ]

    if allow_edits:
        cmd.append("--dangerously-skip-permissions")

    cmd.extend(["--print", prompt])

    workspace_dir = Path(__file__).resolve().parent

    print(f"{Colors.BLUE}Menjalankan agent '{agent_name}' via {Path(agy_exe).name}...{Colors.RESET}")

    try:
        process = subprocess.run(
            cmd,
            cwd=str(workspace_dir),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout_seconds,
        )

        output = process.stdout.strip()
        if process.returncode != 0:
            err_msg = process.stderr.strip() or output
            raise RuntimeError(f"Agent '{agent_name}' gagal dengan kode {process.returncode}:\n{err_msg}")

        return output
    except subprocess.TimeoutExpired:
        raise TimeoutError(f"Agent '{agent_name}' melebihi batas waktu ({timeout_seconds} detik).")


def get_git_diff() -> str:
    """Retrieves unstaged and staged git diff for reviewer audit."""
    try:
        diff_res = subprocess.run(
            ["git", "diff", "HEAD"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        return diff_res.stdout.strip()
    except Exception:
        return ""


def run_bun_tests(cwd: Path) -> Tuple[bool, str]:
    """Runs 'bun test' in the specified directory and returns (passed, output)."""
    try:
        res = subprocess.run(
            ["bun", "test"],
            cwd=str(cwd),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=60,
        )
        combined = f"{res.stdout}\n{res.stderr}".strip()
        return (res.returncode == 0, combined)
    except Exception as e:
        return (False, f"Gagal mengeksekusi bun test: {e}")


def save_plan_to_disk(plan_content: str, feature_slug: str) -> Path:
    """Saves the generated plan into .agents/plans/ for auditability."""
    plans_dir = Path(__file__).resolve().parent / ".agents" / "plans"
    plans_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    clean_slug = "".join(c if c.isalnum() else "_" for c in feature_slug[:30]).strip("_")
    filename = f"plan_{timestamp}_{clean_slug}.md"
    file_path = plans_dir / filename

    file_path.write_text(plan_content, encoding="utf-8")
    return file_path


def run_pipeline(
    feature_request: str,
    model: str = "gemini-3.8-flash-high",
    auto_approve: bool = False,
    max_review_loops: int = 2,
    max_test_loops: int = 2,
) -> None:
    workspace_dir = Path(__file__).resolve().parent
    backend_dir = workspace_dir / "backend"
    frontend_dir = workspace_dir / "frontend"

    print_banner("MULTI-AGENT FEATURE RUNNER (Leader, Planner, Executor, Tester, Reviewer)")
    print(f"{Colors.BOLD}Permintaan Fitur:{Colors.RESET} {feature_request}")
    print(f"{Colors.BOLD}Model:{Colors.RESET} {model}\n")

    # -------------------------------------------------------------
    # 1. LEADER: Assessment & Scope
    # -------------------------------------------------------------
    print_step("Leader", "Menganalisis urgensi kebutuhan, prinsip YAGNI, dan batas scope...")
    leader_prompt = (
        f"Pengguna ingin menambahkan fitur baru:\n\"{feature_request}\"\n\n"
        "Sebagai Project Leader:\n"
        "1. Lakukan evaluasi kritis apakah fitur ini melanggar YAGNI atau menambah abstraksi prematur.\n"
        "2. Identifikasi batasan lingkup (scope) yang jelas (apa yang dibuat vs apa yang TIDAK boleh dibuat).\n"
        "3. Berikan arahan arsitektural spesifik untuk Planner (kepatuhan Hexagonal Ports & Adapters, SOLID, Dual-Domain UI)."
    )
    leader_output = invoke_agent("leader", leader_prompt, model=model)
    print(f"{Colors.GREEN}{leader_output}{Colors.RESET}\n")

    # -------------------------------------------------------------
    # 2. PLANNER: Architecture, Implementation Plan & Test Strategy
    # -------------------------------------------------------------
    plan_feedback = ""
    planner_plan = ""
    while True:
        print_step("Planner", "Menyusun rencana implementasi dan strategi pengujian...")
        planner_prompt = (
            f"Permintaan Fitur: \"{feature_request}\"\n\n"
            f"Arahan Leader:\n{leader_output}\n\n"
        )
        if plan_feedback:
            planner_prompt += f"Feedback Pengguna Sebelumnya:\n{plan_feedback}\n\nPerbaiki rencana berdasarkan feedback ini.\n"

        planner_prompt += (
            "Susun rencana implementasi terstruktur mengikuti format wajib:\n"
            "1. Analisis Masalah & Scope\n"
            "2. Daftar Perubahan File ([NEW], [MODIFY], [DELETE])\n"
            "3. Verifikasi Aturan (.agents/rules/):\n"
            "   - Backend: Hexagonal Ports/Adapters, Single Service Call, 4-digit custom codes.\n"
            "   - Frontend: Two-Font rule (Playfair Display untuk H1/H2, Plus Jakarta Sans untuk lainnya), semantic tokens, data-testid.\n"
            "   - Larangan penggunaan tipe 'any' tanpa pengecualian.\n"
            "4. Strategi Pengujian Otomatis untuk Tester Agent:\n"
            "   - Skenario Unit Test: isolasi service dengan mock repository port (bun:test), edge cases.\n"
            "   - Skenario E2E / Integration Test: alur endpoint Elysia via app.handle, verifikasi status code & ApiResponse envelope.\n"
            "5. Strategi Verifikasi (typecheck & bun test commands)\n"
            "HANYA hasilkan rencana teknis, jangan langsung menulis file aplikasi."
        )
        planner_plan = invoke_agent("planner", planner_prompt, model=model)
        print(f"\n{planner_plan}\n")

        saved_path = save_plan_to_disk(planner_plan, feature_request)
        print_success(f"Rencana implementasi tersimpan di: {saved_path}")

        # ---------------------------------------------------------
        # 3. SEMI-AUTONOMOUS APPROVAL GATE
        # ---------------------------------------------------------
        if auto_approve:
            print_warning("Auto-approve aktif. Melanjutkan otomatis ke tahap Executor...")
            break

        print_banner("APPROVAL GATE")
        print(f"{Colors.BOLD}Silakan tinjau rencana di atas.{Colors.RESET}")
        user_choice = input(
            f"{Colors.YELLOW}[?] Lanjutkan eksekusi? [y/N/feedback]: {Colors.RESET}"
        ).strip()

        if user_choice.lower() in ("y", "yes"):
            print_success("Rencana disetujui oleh pengguna.")
            break
        elif user_choice.lower() in ("n", "no", ""):
            print_error("Eksekusi dibatalkan oleh pengguna.")
            sys.exit(0)
        else:
            print_warning(f"Memproses masukan revisi: '{user_choice}'...")
            plan_feedback = user_choice

    # -------------------------------------------------------------
    # 4. EXECUTOR: Code Implementation & Build/Test Check
    # -------------------------------------------------------------
    print_step("Executor", "Mulai mengimplementasikan kode berdasarkan rencana yang disetujui...")
    executor_prompt = (
        f"Eksekusi rencana implementasi berikut untuk fitur \"{feature_request}\":\n\n"
        f"{planner_plan}\n\n"
        "Instruksi Eksekusi:\n"
        "1. Terapkan modifikasi atau pembuatan file dengan teliti.\n"
        "2. Jangan gunakan tipe 'any' sama sekali.\n"
        "3. Ikuti aturan Hexagonal (controller hanya 1 service call, query DB di repository).\n"
        "4. Tambahkan atribut data-testid pada elemen UI baru.\n"
        "5. Jalankan verifikasi 'bun run --cwd backend typecheck' atau 'bun run --cwd frontend typecheck' jika relevan.\n"
        "Laporkan file apa saja yang telah dibuat/diubah dan status verifikasinya."
    )
    executor_output = invoke_agent("executor", executor_prompt, model=model, allow_edits=True)
    print(f"\n{executor_output}\n")

    # -------------------------------------------------------------
    # 5. TESTER: Unit Testing & End-to-End (E2E) Test Suite Creation
    # -------------------------------------------------------------
    tester_output = ""
    test_run_summary = ""
    for test_loop in range(1, max_test_loops + 1):
        print_step("Tester", f"Menulis dan menjalankan Unit Tests & E2E Tests (Iterasi {test_loop}/{max_test_loops})...")
        git_diff_for_tester = get_git_diff()
        tester_prompt = (
            f"Fitur: \"{feature_request}\"\n\n"
            f"Rencana Arsitektur & Strategi Pengujian:\n{planner_plan}\n\n"
            f"Laporan Executor:\n{executor_output}\n\n"
            f"Git Diff Implementasi:\n```diff\n{git_diff_for_tester[:8000]}\n```\n\n"
            "Tugas Anda:\n"
            "1. Tulis Unit Tests (*.test.ts) menggunakan 'bun:test' dengan mengisolasi outbound repository ports menggunakan in-memory mock class.\n"
            "2. Tulis E2E / Integration Tests menguji endpoint Elysia melalui app.handle(new Request(...)) atau skenario pengguna.\n"
            "3. Pastikan penanganan error (AppDomainError) dan status code teruji dengan benar.\n"
            "4. Jalankan 'bun test' di backend/frontend dan pastikan semua test berstatus passing (0 fail).\n"
            "Laporkan file test yang dibuat dan ringkasan eksekusi test."
        )
        tester_output = invoke_agent("tester", tester_prompt, model=model, allow_edits=True)
        print(f"\n{tester_output}\n")

        # Jalankan eksekusi test nyata secara otomatis
        backend_ok, backend_test_log = run_bun_tests(backend_dir)
        frontend_ok, frontend_test_log = run_bun_tests(frontend_dir)

        test_run_summary = (
            f"Backend bun test: {'PASS' if backend_ok else 'FAIL'}\n{backend_test_log}\n\n"
            f"Frontend bun test: {'PASS' if frontend_ok else 'FAIL'}\n{frontend_test_log}"
        )
        print(f"{Colors.BLUE}[HASIL EKSEKUSI BUN TEST]\n{test_run_summary}{Colors.RESET}\n")

        if backend_ok and frontend_ok:
            print_success("Semua Unit Tests dan E2E Tests berhasil dieksekusi dengan sukses (PASS)!")
            break
        else:
            print_warning(f"Terdapat pengujian yang gagal (Iterasi {test_loop}/{max_test_loops}).")
            if test_loop < max_test_loops:
                fix_test_prompt = (
                    f"Pengujian bun test gagal dengan rincian log berikut:\n{test_run_summary}\n\n"
                    "Analisis penyebab kegagalan test dan perbaiki kode test atau mock hingga seluruh test lulus."
                )
                tester_output = invoke_agent("tester", fix_test_prompt, model=model, allow_edits=True)
                print(f"\n{tester_output}\n")

    # -------------------------------------------------------------
    # 6. REVIEWER: Quality, Architecture & Security Audit Loop
    # -------------------------------------------------------------
    reviewer_output = ""
    for loop in range(1, max_review_loops + 1):
        print_step("Reviewer", f"Melakukan audit kode, kepatuhan arsitektur & kelengkapan test (Iterasi {loop}/{max_review_loops})...")
        git_diff = get_git_diff()
        reviewer_prompt = (
            f"Permintaan Fitur: \"{feature_request}\"\n\n"
            f"Rencana Awal:\n{planner_plan}\n\n"
            f"Laporan Executor:\n{executor_output}\n\n"
            f"Laporan Tester (Unit & E2E):\n{tester_output}\n\n"
            f"Hasil Nyata bun test:\n{test_run_summary}\n\n"
            f"Git Diff Terkini:\n```diff\n{git_diff[:8000]}\n```\n\n"
            "Audit kode dan test di atas secara ketat terhadap:\n"
            "1. Larangan tipe 'any'\n"
            "2. Hexagonal Clean Architecture (Inbound/Outbound isolation, Thin Controller)\n"
            "3. Desain UI (Two-Font rule, semantic colors, data-testid)\n"
            "4. SOLID & Code Splitting (ukuran file < 200 baris)\n"
            "5. Kelengkapan dan kualitas Unit Test & E2E Test (tidak boleh ada dummy assertion)\n\n"
            "Berikan keputusan tegas di baris pertama:\n"
            "'VERDICT: APPROVED' atau 'VERDICT: CHANGES_REQUESTED'\n"
            "Jika CHANGES_REQUESTED, jelaskan file dan baris yang melanggar beserta solusi konkret."
        )
        reviewer_output = invoke_agent("reviewer", reviewer_prompt, model=model)
        print(f"\n{reviewer_output}\n")

        if "VERDICT: APPROVED" in reviewer_output:
            print_success("Audit Reviewer: DISETUJUI (APPROVED)!")
            break
        else:
            print_warning(f"Reviewer meminta perbaikan (Iterasi {loop}/{max_review_loops}).")
            if loop < max_review_loops:
                print_step("Executor", "Memperbaiki catatan dari Reviewer...")
                fix_prompt = (
                    f"Reviewer menemukan catatan perbaikan berikut:\n{reviewer_output}\n\n"
                    "Segera perbaiki kode yang melanggar aturan dan jalankan verifikasi typecheck/test ulang."
                )
                executor_output = invoke_agent("executor", fix_prompt, model=model, allow_edits=True)
                print(f"\n{executor_output}\n")
            else:
                print_error("Batas iterasi review tercapai. Harap periksa manual catatan Reviewer.")

    # -------------------------------------------------------------
    # 7. LEADER: Final Summary & Sign-off
    # -------------------------------------------------------------
    print_step("Leader", "Menyusun ringkasan akhir dan sign-off...")
    summary_prompt = (
        f"Fitur: \"{feature_request}\"\n\n"
        f"Laporan Akhir Executor:\n{executor_output}\n\n"
        f"Laporan Tester:\n{tester_output}\n\n"
        f"Keputusan Reviewer:\n{reviewer_output}\n\n"
        "Buat ringkasan eksekutif singkat: apa saja yang telah diselesaikan, cakupan unit & E2E tests, perubahan arsitektur utama, dan status kesiapan rilis."
    )
    final_summary = invoke_agent("leader", summary_prompt, model=model)
    print_banner("RINGKASAN AKHIR DARI LEADER")
    print(f"{Colors.GREEN}{final_summary}{Colors.RESET}\n")
    print_success("Pipeline Multi-Agent Selesai!")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Multi-Agent Feature Runner (Leader, Planner, Executor, Tester, Reviewer) for invitation-wedding."
    )
    parser.add_argument(
        "feature",
        nargs="?",
        default="",
        help="Deskripsi fitur yang ingin dibuat.",
    )
    parser.add_argument(
        "-f",
        "--feature-text",
        dest="feature_opt",
        default="",
        help="Deskripsi fitur (opsional via flag).",
    )
    parser.add_argument(
        "-m",
        "--model",
        default="gemini-3.8-flash-high",
        help="Model yang digunakan oleh agen (default: gemini-3.8-flash-high).",
    )
    parser.add_argument(
        "--auto-approve",
        action="store_true",
        help="Lewati konfirmasi interaktif setelah tahap Planner.",
    )
    parser.add_argument(
        "--max-review-loops",
        type=int,
        default=2,
        help="Maksimum loop perbaikan Executor-Reviewer jika ada temuan (default: 2).",
    )
    parser.add_argument(
        "--max-test-loops",
        type=int,
        default=2,
        help="Maksimum loop perbaikan Tester jika test gagal (default: 2).",
    )

    args = parser.parse_args()
    feature_text = args.feature or args.feature_opt

    if not feature_text.strip():
        print_banner("MULTI-AGENT FEATURE RUNNER")
        try:
            feature_text = input(
                f"{Colors.BOLD}{Colors.CYAN}Masukkan deskripsi fitur yang ingin Anda tambahkan:{Colors.RESET} "
            ).strip()
        except (KeyboardInterrupt, EOFError):
            print("\nDibatalkan.")
            sys.exit(0)

    if not feature_text.strip():
        print_error("Deskripsi fitur tidak boleh kosong.")
        sys.exit(1)

    try:
        run_pipeline(
            feature_request=feature_text,
            model=args.model,
            auto_approve=args.auto_approve,
            max_review_loops=args.max_review_loops,
            max_test_loops=args.max_test_loops,
        )
    except Exception as e:
        print_error(f"Terjadi kesalahan dalam eksekusi pipeline: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
